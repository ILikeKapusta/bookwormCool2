
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

function setHTTPHeaders(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

exports.getBookInfo = functions.https.onRequest(async (req, res) => {
  setHTTPHeaders(res)
  
  try {
    const bookId = req.url; // Assuming the bookId is part of the URL
    const bookSnapshot = await admin.firestore().collection('BookCollection').doc(bookId).get();

    if (!bookSnapshot.exists) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const bookData = bookSnapshot.data();
    return res.status(200).json({ book: bookData });
  } catch (error) {
    console.error('Error getting book information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.getReviewBookInfo = functions.https.onRequest(async (req, res) => {
  setHTTPHeaders(res)
  
  try {
    const bookId = req.url; // Assuming the bookId is part of the URL
    const bookSnapshot = await admin.firestore().collection('BookReviewsCollection').doc(bookId).get();

    if (!bookSnapshot.exists) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const bookData = bookSnapshot.data();
    return res.status(200).json({ book: bookData });
  } catch (error) {
    console.error('Error getting book information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



exports.getUserInfo = functions.https.onRequest(async (req, res) => {
  setHTTPHeaders(res)

  try {
    const userSnapshot = await admin.firestore().collection('users').get();
    const userData = [];

    userSnapshot.forEach((userDoc) => {
      const user = userDoc.data();
      const userId = userDoc.id;
      userData.push({ id: userId, ...user });
    });

    return res.status(200).json({ users: userData });
  } catch (error) {
    console.error('Error getting user information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



exports.getBookDetails = functions.https.onRequest(async (req, res) => {
  setHTTPHeaders(res)

  try {
    const commentsSnapshot = await admin.firestore().collection('BookComments').get();
    const commentsData = [];

    commentsSnapshot.forEach((commentDoc) => {
      const comment = commentDoc.data();
      commentsData.push(comment);
    });

    return res.status(200).json({ comments: commentsData });
  } catch (error) {
    console.error('Error getting book details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});