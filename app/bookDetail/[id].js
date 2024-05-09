import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import { usePathname } from "expo-router";
import HTML from "react-native-render-html";
import Navbar from "../../components/navbar";
import { db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

const BookDetail = ({}) => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, "comments");
        const q = query(commentsRef, where("bookId", "==", id));
        const querySnapshot = await getDocs(q);
        const fetchedComments = [];
        querySnapshot.forEach((doc) => {
          fetchedComments.push({ id: doc.id, ...doc.data() });
        });
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const commentsRef = collection(db, "comments");
      const q = query(commentsRef, where("bookId", "==", id));
      const querySnapshot = await getDocs(q);
      const fetchedComments = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() });
      });
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  if (!book) {
    return null;
  }

  const handleAddComment = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    if (!user) {
      // Show Modal if user is not authenticated
      setShowModal(true);
      return;
    }

    if (newComment.trim().length > 300) {
      alert("Comment should be less than 300 characters");
      return;
    }

    // Validate comment text
    if (!newComment.trim()) {
      // Show error message or alert
      alert("Please enter a comment before submitting.");
      return;
    }
    try {
      // Fetch user's name from Firestor

      await addDoc(collection(db, "comments"), {
        userId: user.uid,
        bookId: id,
        text: newComment,
        name: user.displayName, // Use the name from Firestore
      });

      // Clear the input field after adding the comment
      setNewComment("");
      // After adding a new comment, refetch comments to update the UI
      fetchComments();
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

        <Text style={{ fontFamily: "", fontSize: 24, fontStyle: "italic" }}>
          {" "}
          Comments{" "}
        </Text>
        {comments.map((comment) => (
          <View>
            <View style={styles.comment} key={comment.id}>
              <Image
                source={require("../../assets/profileIcon.png")}
                style={{ width: 50, height: 50, borderRadius: 50 }}
              />
              <View style={{ gap: 10 }}>
                <Text style={styles.commentOwner}>{comment.name}</Text>
                <Text>{comment.text}</Text>
              </View>
            </View>
            <View style={styles.seperator}></View>
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

        {/* Modal for authentication */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                You should sign-up for adding comment
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

  comment: {
    flex: 1,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 20,
  },
  commentInput: {
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    height: 80,
    borderBlockColor: "#d3d3d3",
    borderBlockWidth: 1,
    borderColor: "#d3d3d3",
    borderWidth: 1,
  },

  commentOwner: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },

  seperator: {
    height: 1,
    width: "100%", // Corrected property name
    backgroundColor: "#ddd",
    marginBottom: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default BookDetail;
