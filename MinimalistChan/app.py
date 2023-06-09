from flask import Flask, render_template, request, jsonify
from models import Post, db
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/posts', methods=['GET', 'POST'])
def posts():
    if request.method == 'POST':
        content = request.json['content']
        new_post = Post(content=content)
        db.session.add(new_post)
        db.session.commit()
        return jsonify(new_post.serialize())

    posts = Post.query.order_by(Post.timestamp.desc()).all()
    return jsonify([post.serialize() for post in posts])

@app.route('/posts/<int:post_id>/replies', methods=['POST'])
def replies(post_id):
    post = Post.query.get_or_404(post_id)
    content = request.json['content']
    reply = Post(content=content, parent_id=post.id)
    db.session.add(reply)
    db.session.commit()
    return jsonify(reply.serialize())

if __name__ == '__main__':
    app.run()