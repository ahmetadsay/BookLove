import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import { usePathname } from "expo-router";
import HTML from "react-native-render-html";
import Navbar from "../../components/navbar";
import { db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const BookDetail = ({}) => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) {
    return null;
  }

  // useEffect(() => {
  //   const unsubscribe = db
  //     .collection("comments")
  //     .where("bookId", "==", id)
  //     .onSnapshot((snapshot) => {
  //       const fetchedComments = [];
  //       snapshot.forEach((doc) => {
  //         fetchedComments.push({ id: doc.id, ...doc.data() });
  //       });
  //       setComments(fetchedComments);
  //     });

  //   return () => unsubscribe(); // This line should be inside the useEffect hook
  // }, [id]);

  const handleAddComment = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    if (!user) {
      // Handle case when user is not authenticated
      return;
    }

    try {
      await addDoc(collection(db, "comments"), {
        userId: user.uid,
        bookId: id,
        text: newComment,
      });

      console.log('user.uid', user.uid)

      // Clear the input field after adding the comment
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>
          {book.volumeInfo && book.volumeInfo.imageLinks && (
            <Image
              source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
              style={styles.image}
            />
          )}
          {book.volumeInfo && book.volumeInfo.title && (
            <Text style={styles.title}>{book.volumeInfo.title}</Text>
          )}
          {book.volumeInfo && book.volumeInfo.authors && (
            <Text style={styles.author} ellipsizeMode="tail">
              {book.volumeInfo.authors[0]}
            </Text>
          )}
          {book.volumeInfo && book.volumeInfo.description && (
            <HTML source={{ html: book.volumeInfo.description }} />
          )}
        </View>
        {comments.map((comment) => (
          <View key={comment.id}>
            <Text>{comment.text}</Text>
          </View>
        ))}

        {/* Add comment form */}
        <TextInput
          placeholder="Add a comment"
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
          style={styles.commentInput}
        />
        <Button title="Add Comment" onPress={handleAddComment} />
      </ScrollView>
      <Navbar style={styles.navbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginHorizontal: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    paddingVertical: 20,
    gap: 20,
  },
  image: {
    width: 190,
    height: 280,
    marginBottom: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  author: {
    fontSize: 16,
    color: "#A3A3A3",
    textAlign: "center",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default BookDetail;
