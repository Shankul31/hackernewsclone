import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListView.scss";
import GraphView from "../graphView/GraphView";
import moment from "moment";

function ListView() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let [pageNum, setPageNum] = useState(0);
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
      if (pageNum >= 0) {
        getPageResults(pageNum);
      }
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
    let upVotes = JSON.parse(localStorage.getItem("upVoteList")) || [];
    let deletedIndex = JSON.parse(localStorage.getItem("deletedIndex")) || [];
    deletedIndex.push(listId);
    localStorage.setItem("deletedIndex", JSON.stringify(deletedIndex));
    setHide(true);
    setDeletedItem(JSON.parse(localStorage.getItem("deletedIndex")));

    upVotes.forEach((element, index) => {
      if (element.id === listId) {
        upVotes.splice(index, 1);
      }
    });
    localStorage.setItem("upVoteList", JSON.stringify(upVotes));
    setUpVoteCountsData(JSON.parse(localStorage.getItem("upVoteList")));
  };

  return (
    <div>
      <div className="list-container-wrapper">
        <ul>
          <li className="table-header">
            <p className="header">Comments</p>
            <p className="header">Vote Count</p>
            <p className="header">UpVote</p>
            <p className="news-detail-header">News Details</p>
          </li>
          {data &&
            data.map((item, index) => {
              return (
                <li
                  key={index}
                  style={{
                    display:
                      deletedItem && deletedItem.includes(item.objectID)
                        ? "none"
                        : "",
                  }}
                >
                  <p className="header">
                    {" "}
                    {item.num_comments ? item.num_comments : "-"}
                  </p>
                  <p className="header">
                    {upVoteCountsData &&
                      upVoteCountsData.map((element) => {
                        if (element.id === item.objectID) {
                          return element.upVoteCount;
                        }
                      })}
                  </p>
                  <p className="header">
                    <span
                      className="upvote-button"
                      onClick={(evt) => handleUpVote(item.objectID)}
                    >
                      &#9650;
                    </span>
                  </p>
                  <p className="detail-header">
                    {item.title}
                    {item.title && (
                      <small>
                        <a
                          style={{ marginLeft: "5px", marginRight: "5px" }}
                          href={item.url}
                          target="_blank"
                        >
                          ({item.url})
                        </a>
                      </small>
                    )}
                    {item.title && (
                      <small style={{ marginLeft: "5px", marginRight: "5px" }}>
                        by <b>{item.author}</b>
                      </small>
                    )}
                    {item.title && (
                      <small style={{ marginLeft: "5px", marginRight: "5px" }}>
                        {moment(item.created_at_i).format("LL")}
                      </small>
                    )}
                    {item.title && (
                      <span
                        onClick={(evt) => handleHide(item.objectID)}
                        style={{
                          display: !item.title ? "none" : "",
                          cursor: "pointer",
                        }}
                      >
                        [hide]
                      </span>
                    )}
                  </p>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="button-wrapper">
        <a onClick={(evt) => fetchPosts("prev")}>Prev</a>
        <span style={{ marginLeft: "10px", marginRight: "10px" }}>|</span>
        <a onClick={(evt) => fetchPosts("next")}>Next</a>
      </div>
      <hr />
      <GraphView data={upVoteCountsData} />
    </div>
  );
}

export default ListView;
