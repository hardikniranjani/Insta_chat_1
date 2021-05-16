import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import InstagramIcon from '@material-ui/icons/Instagram';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Post from './Post';
import './App.css';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    //setOpenSignIn(false);
  }

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      }
      else {
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions 
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  return (
    <div className="app">
      <div className="login_page">
        <Modal
          open={open}
          onClose={() => setOpen(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className={classes.root} noValidate autoComplete="off">
              <center>
                <div className="header_button_icon">
                  <InstagramIcon />
                </div>
              </center>
              <TextField type="text" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <TextField type="text" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField type="password" label="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" onClick={signUp}>Sign up</Button>
            </form>
          </div>
        </Modal>
        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className={classes.root} noValidate autoComplete="off">
              <center>
                <div className="header_button_icon">
                  <InstagramIcon />
                </div>
              </center>
              <TextField type="text" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField type="password" label="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" onClick={signIn}>Login</Button>
            </form>
          </div>
        </Modal>
      </div>
      <div className="header">
        <div className="header_left">
          <>
            {user ? (<h4>{user.displayName}</h4>) : (
              <div className="display">
                <h4>Hi</h4>
              </div>
            )}
          </>
        </div>
        <div className="header__icon">
          <InstagramIcon /></div>
        <div className="header__icon__login">
          {user ? (
            <div className="app__logoutcontainer">
              <Button onClick={() => auth.signOut()}>Logout</Button></div>
          ) : (

            <div className="app__logincontainer" >
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              <Button onClick={() => setOpen(true)}>Sign up</Button>
            </div>

          )}</div>  
      </div>
      <div>
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h4>You need to LOGIN for upload post</h4>
        )}
      </div>
      {
        posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
            timestamp={post.timestamp} />
        ))
      }
    </div>
  );
}

export default App;




