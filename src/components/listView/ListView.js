import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListView.scss";

function ListView() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let [pageNum, setPageNum] = useState(1);

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
      .then((res) => setData(res.data.hits))
      .catch((err) => console.log("error", err));
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
                <li key={index}>
                  <p className="header">{item.num_comments}</p>
                  <p className="header">Vote Count</p>
                  <p className="header">UpVote</p>
                  <p className="detail-header">{item.title}</p>
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
