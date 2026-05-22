from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movies.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Definição da Tabela de Avaliações
class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tmdb_id = db.Column(db.Integer, unique=True, nullable=False) # ID do filme no TMDB
    title = db.Column(db.String(200), nullable=False)
    poster_path = db.Column(db.String(200)) 
    rating = db.Column(db.Integer, nullable=False) # Nota de 1 a 5

    # Função auxiliar para transformar o objeto em JSON
    def to_dict(self):
        return {
            "id": self.id,
            "tmdb_id": self.tmdb_id,
            "title": self.title,
            "poster_path": self.poster_path,
            "rating": self.rating
        }

# Cria o arquivo do banco de dados se ele não existir
with app.app_context():
    db.create_all()


# 1. CRIAR uma nova avaliação 
@app.route('/ratings', methods=['POST'])
def add_rating():
    data = request.json
    
    # Validação simples
    if not data or 'tmdb_id' not in data or 'rating' not in data:
        return jsonify({"error": "Incomplete data. tmdb_id and rating are required."}), 400
        
    # Verifica se o filme já foi avaliado
    existing = Rating.query.filter_by(tmdb_id=data['tmdb_id']).first()
    if existing:
        return jsonify({"error": "This movie has already been rated."}), 400
        
    new_rating = Rating(
        tmdb_id=data['tmdb_id'],
        title=data.get('title', 'Title Unknown'),
        poster_path=data.get('poster_path', ''),
        rating=data['rating']
    )
    
    db.session.add(new_rating)
    db.session.commit()
    
    return jsonify(new_rating.to_dict()), 201

# 2. LER todas as avaliações 
@app.route('/ratings', methods=['GET'])
def get_ratings():
    ratings = Rating.query.all()
    return jsonify([r.to_dict() for r in ratings]), 200

# 3. ATUALIZAR uma avaliação existente 
@app.route('/ratings/<int:tmdb_id>', methods=['PUT'])
def update_rating(tmdb_id):
    data = request.json
    rating_obj = Rating.query.filter_by(tmdb_id=tmdb_id).first()
    
    if not rating_obj:
        return jsonify({"error": "Rating not found."}), 404
        
    if 'rating' in data:
        rating_obj.rating = data['rating']
        db.session.commit()
        
    return jsonify(rating_obj.to_dict()), 200

# 4. DELETAR uma avaliação 
@app.route('/ratings/<int:tmdb_id>', methods=['DELETE'])
def delete_rating(tmdb_id):
    rating_obj = Rating.query.filter_by(tmdb_id=tmdb_id).first()
    
    if not rating_obj:
        return jsonify({"error": "Rating not found."}), 404
        
    db.session.delete(rating_obj)
    db.session.commit()
    
    return jsonify({"message": "Rating successfully deleted."}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)