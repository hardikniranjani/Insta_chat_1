import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';

function Post({ username, caption, user, imageUrl, postId, timestamp }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');


    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            {/*header -> avatar + username */}
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="/static/image/avatar/1.jpg"
                />
                <div className="post__headerText">
                    <h4>{username}</h4>
                    <p>{new Date(timestamp?.toDate()).toUTCString()}</p>
                </div>
            </div>

            <img className="post__image" src={imageUrl} alt="" />

            <div className="post__text">
                <strong>{username}</strong> : {caption}
            </div>
            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username} :</strong>  {comment.text}
                    </p>
                ))}
            </div>

            <form className="post__comment__box">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    className="post__button"
                    disabled={!comment }
                    type="submit"
                    onClick={postComment}
                >Post</button>
            </form>

        </div>
    );
}

export default Post;
