import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';
import FileUpload from './FileUpload';



function ImageUpload({ username }) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`image/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error Function
                console.log(error);
                alert(error.message);
            },
            () => {
                // Final Part
                storage
                    .ref("image")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post Img..
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            })
    };

    return (
        <div className="imageupload">
            <div className="tweetbox_input">
                <textarea placeholder="Enter a caption" value={caption} onChange={event => setCaption(event.target.value)} />
            </div>
            <div className="fileupload" onChange={handleChange} >
                <FileUpload />
                <progress className="progess_bar" value={progress} max="100" />
            </div>
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload;
