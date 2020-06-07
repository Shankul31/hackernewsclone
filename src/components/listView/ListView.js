import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListView.scss";

function ListView() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let [pageNum, setPageNum] = useState(1);
  const [upVoteCountsData, setUpVoteCountsData] = useState(
    JSON.parse(localStorage.getItem("upVoteList"))
  );
  let [hide, setHide] = useState(false);
  const [deletedItem, setDeletedItem] = useState(
    JSON.parse(localStorage.getItem("deletedIndex"))
  );

  useEffect(() => {
    getPageResults(pageNum);
  }, []);

  const fetchPosts = (actionType) => {
    if (actionType === "prev") {
      --pageNum;
      setPageNum(pageNum);
      getPageResults(pageNum);
    }
    if (actionType === "next") {
      ++pageNum;
      setPageNum(pageNum);
      getPageResults(pageNum);
    }
  };

  const getPageResults = (pageNum) => {
    axios
      .get(`http://hn.algolia.com/api/v1/search?page=${pageNum}`)
      .then((res) => {
        setData(res.data.hits);
      })
      .catch((err) => console.log("error", err));
  };

  //   const updateUpVoteCount = () => {
  //     const updateData = JSON.parse(JSON.stringify(data));
  //     let upVotes = JSON.parse(localStorage.getItem("upVoteList")) || [];
  //     updateData.forEach((data) => {
  //       upVotes.forEach((element) => {
  //         if (data.objectID === element.id) {
  //           data.upVoteCount = element.upVoteCount;
  //         }
  //       });
  //     });
  //     setData(updateData);
  //   };

  const handleUpVote = (id) => {
    let upVoteIndexes = JSON.parse(localStorage.getItem("upVoteIndexes")) || [];
    let upVotes = JSON.parse(localStorage.getItem("upVoteList")) || [];
    let count = 0;
    if (!upVoteIndexes.includes(id)) {
      upVotes.push({ id: id, upVoteCount: count });
      upVoteIndexes.push(id);
    } else {
      upVotes.forEach((element) => {
        if (element.id === id) {
          element.upVoteCount++;
        }
      });
    }
    localStorage.setItem("upVoteList", JSON.stringify(upVotes));
    localStorage.setItem("upVoteIndexes", JSON.stringify(upVoteIndexes));
    setUpVoteCountsData(JSON.parse(localStorage.getItem("upVoteList")));
  };

  const handleHide = (listId) => {
    let deletedIndex = JSON.parse(localStorage.getItem("deletedIndex")) || [];
    deletedIndex.push(listId);
    localStorage.setItem("deletedIndex", JSON.stringify(deletedIndex));
    setHide(true);
    setDeletedItem(JSON.parse(localStorage.getItem("deletedIndex")));
  };

  return (
    <div>
      <div className="list-container-wrapper">
        <ul>
          <li>
            <p className="header">Comments</p>
            <p className="header">Vote Count</p>
            <p className="header">UpVote</p>
            <p className="detail-header">News Details</p>
          </li>
          {data &&
            data.map((item, index) => {
              return (
                <li
                  key={index}
                  style={{
                    display:
                      hide && deletedItem.includes(item.objectID) ? "none" : "",
                  }}
                >
                  <p className="header">{item.num_comments}</p>
                  <p className="header">
                    {upVoteCountsData &&
                      upVoteCountsData.map((element) => {
                        if (element.id === item.objectID) {
                          return element.upVoteCount;
                        }
                      })}
                  </p>
                  <button onClick={(evt) => handleUpVote(item.objectID)}>
                    UpVote
                  </button>
                  <p className="detail-header">{item.title}</p>
                  <button onClick={(evt) => handleHide(item.objectID)}>
                    hide
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="button-wrapper">
        <button onClick={(evt) => fetchPosts("prev")}>Prev</button>
        <button onClick={(evt) => fetchPosts("next")}>Next</button>
      </div>
    </div>
  );
}

export default ListView;
