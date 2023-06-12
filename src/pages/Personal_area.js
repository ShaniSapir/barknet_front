import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the Link component
import axios from "axios";
import "./Personal_area.css";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import RegistrationForm from "./RegistrationForm";

function Personal_area() {
  const navigate = useNavigate();
  const arrStatPic = ["https://worldanimalfoundation.org/wp-content/uploads/2023/02/4-1024x768.jpg", "https://www.wiscontext.org/sites/default/files/assets/images/apl-demographics-dogs-madison-breeds-2016-piechart.jpg", "https://cdn.vox-cdn.com/thumbor/k7ptfn4JhwVxU8T3dXNJTNfEfjg=/0x0:2617x1990/1200x0/filters:focal(0x0:2617x1990):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/7025029/222FINAL.0.png"];
  const history = useNavigate();
  const visited = localStorage.getItem("visitedUser");
  const current = localStorage.getItem("currentUser");
  const flagSomeoneElse = current !== visited;
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  const [editMode, setEditMode] = useState(false); // Edit mode flag
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: ""
  }); // Edited user details
  const [isFollowing, setIsFollowing] = useState(false); // Following flag
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteButton, setShowDeleteButton] = useState(true);

  async function handleLoading() {
    try {
      const response = await axios.post("http://localhost:8000/personal_area", {
        visited
      });
      const {
        username,
        firstName,
        lastName,
        email,
        birthdate
      } = response.data;
      setUser({
        username,
        firstName,
        lastName,
        email,
        birthdate
      });
      const postsResponse = await axios.post("http://localhost:8000/my_posts", {
        visited
      });
      setPosts(postsResponse.data);
      setShowDeleteButton(current === visited); // Show the delete button if the visited

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleLoading();
  }, [visited, current]);

  useEffect(() => {
    // Check if the user is already being followed
    const checkFollowing = async () => {
      try {
        const response = await axios.post("http://localhost:8000/check_following", {
          visited,
          current
        });
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.log(error);
      }
    };
    if (flagSomeoneElse) {
      checkFollowing();
    }
  }, [visited, current, flagSomeoneElse]);

  const handleEditClick = () => {
    // Enable edit mode
    setEditMode(true);
    // Set the edited user details
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthdate: user.birthdate
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the edited user details based on input changes
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSaveClick = async () => {
    try {
      // Perform API call to update user details in the backend
      const response = await axios.post("http://localhost:8000/update_user", {
        visited,
        ...editedUser
      });
      const {
        username,
        firstName,
        lastName,
        email,
        birthdate
      } = response.data;
      // Update the user details in the state
      setUser({
        username,
        firstName,
        lastName,
        email,
        birthdate
      });
      // Disable edit mode
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFollowClick = async () => {
    try {
      console.log(isFollowing);
      if (isFollowing) {
        // Unfollow the user
        await axios.post("http://localhost:8000/unfollow", {
          visited,
          current
        });
      } else {
        // Follow the user
        await axios.post("http://localhost:8000/follow", {
          visited,
          current
        });
      }
      // Toggle the following flag
      setIsFollowing((prevIsFollowing) => !prevIsFollowing);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowersMouseEnter = async () => {
    try {
      const response = await axios.post("http://localhost:8000/get_followers", {
        visited, // Add visited username as parameter
      });
      setFollowers(response.data.followers);
      console.log(response.data.followers);
      setShowFollowers(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowingMouseEnter = async () => {
    try {
      const response = await axios.post("http://localhost:8000/get_following", {
        visited, // Add visited username as parameter
      });
      setFollowing(response.data.following);
      console.log(response.data.following);
      setShowFollowing(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFollowersMouseLeave = () => {
    setShowFollowers(false);
  };

  const handleFollowingMouseLeave = () => {
    setShowFollowing(false);
  };

  /* useEffect(() => {
     fetch("http://localhost:8000/my_posts", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ visited }),
     })
       .then((response) => response.json())
       .then((data) => setPosts(data))
       .catch((error) => console.error("error fetching posts: ", error));
   }, []); */

  const handleXButtonClick = () => {
    if (flagSomeoneElse) {
      localStorage.setItem("visitedUser", current);
      history("/personal_area");
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    const totalImages = 3; // Replace with the total number of images you have
    if (currentImageIndex < totalImages - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  const handleCreatePost = () => {
    // Redirect the user to the "Create Post" page
    history("/new_post");
  };

  const handleDeleteAccount = async () => {
    // Implement the logic to delete the account
    try {
      await axios.post("http://localhost:8000/deleteAccount", {
        username: visited
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="personal-area-page">

        <div className="leftsideDiv">
          {flagSomeoneElse && (
            <button
              type="button"
              style={{ width: 35, cursor: "pointer" }}
              onClick={handleXButtonClick}
            >
              X
            </button>
          )}
          <div className="profile" />
          {flagSomeoneElse && (
            <button
              type="button"
              className={`followButton ${isFollowing ? "unfollow" : ""}`}
              onClick={handleFollowClick}
              style={{ height: 35 }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
          {!flagSomeoneElse && (<button type="button" className="editButton" onClick={handleEditClick}> </button>)}
          {user && (
            <div className="labelsDiv">
              <label htmlFor="userName">
                User Name :
                {user.username}
              </label>
              <label htmlFor="firstName">
                First Name :
                {editMode ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editedUser.firstName}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.firstName
                )}
              </label>
              <label htmlFor="lastName">
                Last Name :
                {editMode ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editedUser.lastName}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.lastName
                )}
              </label>
              <label htmlFor="birth">
                Date of birth  :
                {editMode ? (
                  <input
                    type="text"
                    name="birthdate"
                    value={editedUser.birthdate}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.birthdate
                )}
              </label>
              <label htmlFor="email">
                Email  :
                {editMode ? (
                  <input
                    type="text"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.email
                )}
              </label>
            </div>
          )}
          {editMode && (
            <button type="button" className="saveButton" onClick={handleSaveClick} style={{ height: 35 }}>
              Save
            </button>
          )}
          {showDeleteButton && (
          <button type="button" className="deleteButton" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        )}
        </div>
        <div className="followDiv">
          <button
            className="followerB"
            type="button"
            onMouseEnter={handleFollowersMouseEnter}
            onMouseLeave={handleFollowersMouseLeave}
          >
            Followers
            {showFollowers && (
              <div className="popup">
                {followers.map((follower) => (
                  <p>{follower.followME}</p>
                ))}
              </div>
            )}
          </button>
          <button
            className="followingB"
            type="button"
            onMouseEnter={handleFollowingMouseEnter}
            onMouseLeave={handleFollowingMouseLeave}
          >
            Following
            {showFollowing && (
              <div className="popup">
                {following.map((followed) => (<div>{followed.me}</div>
                ))}
              </div>
            )}
          </button>
          <div className="image-scroll">
            <button type="button" className="scroll-arrow" onClick={handlePreviousImage}>
              &lt;
            </button>
            <img
              src={arrStatPic[currentImageIndex]}
              className="scroll-image"
              alt=" "
            />
            <button type="button" className="scroll-arrow" onClick={handleNextImage}>
              &gt;
            </button>
          </div>
        </div>
        <div className="scrollable1">
          {posts.length === 0 && !flagSomeoneElse && (
            <div>
              <p>You have no posts yet</p>
              <button
                type="button"
                style={{ cursor: "pointer" }}
                onClick={handleCreatePost}
              >
                Create New Post
              </button>
            </div>
          )}
          {posts.map((post) => (
            <Post
              key={post.postID}
              postID={post.postID}
              username={post.username}
              picture={post.picture}
              caption={post.caption}
              hashtag={post.hashtag}
              likesCount={post.likesCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Personal_area;
