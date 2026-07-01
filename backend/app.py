import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg

load_dotenv()

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    return psycopg.connect(DATABASE_URL)

def init_db():
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute('''
            CREATE TABLE IF NOT EXISTS waitlist (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        ''')
    conn.commit()
    conn.close()

@app.route('/api/waitlist', methods=['POST'])
def add_to_waitlist():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                'INSERT INTO waitlist (name, email) VALUES (%s, %s)',
                (name, email)
            )
        conn.commit()
        conn.close()
    except psycopg.errors.UniqueViolation:
        return jsonify({'error': 'Email already on the waitlist'}), 409

    return jsonify({'message': 'Added to waitlist'}), 201

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)