import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
const bookmarksQuerry = gql`
  {
    bookmarks {
      URL
      Description
      DateCreated
      Id
    }
  }
`;
const addBookmarkMutation = gql`
  mutation addBookmark(
    $URL: String
    $Description: String
    $DateCreated: String
    $Id: String
  ) {
    addBookmark(
      URL: $URL
      Description: $Description
      DateCreated: $DateCreated
      Id: $Id
    ) {
      URL
    }
  }
`;
const deleteMyBookmark = gql`
  mutation deleteBookmark($Id: String) {
    deleteBookmark(Id: $Id) {
      Id
    }
  }
`;
const IndexPage = () => {
  const [addBookmark] = useMutation(addBookmarkMutation);
  const [deleteBookmark] = useMutation(deleteMyBookmark);
  const { loading, data, error } = useQuery(bookmarksQuerry);
  const [link, setLink] = React.useState("");
  const [desc, setDesc] = React.useState("");
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error...?</h1>;
  }
  return (
    <>
      <h1>Bookmark WebApp</h1>
      <input
        onChange={(e) => setLink(e.target.value)}
        value={link}
        placeholder="Enter Link"
      />
      <input
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        placeholder="Enter Description"
      />
      <br />
      <button
        onClick={() => {
          let date = new Date();
          addBookmark({
            variables: {
              URL: link,
              Description: desc,
              DateCreated: JSON.stringify(date.getDate()),
            },
            refetchQueries: [{ query: bookmarksQuerry }],
          });
          setLink("");
          setDesc("");
        }}
      >
        Add{" "}
      </button>
      {data.bookmarks?.map((bookmark) => {
        return (
          <div key={bookmark.Id}>
            <h4>{bookmark.URL}</h4>
            <h4>{bookmark.Description}</h4>
            <h4>{bookmark.DateCreated}</h4>
            <button
              onClick={() =>
                deleteBookmark({
                  variables: {
                    Id: bookmark.Id,
                  },
                  refetchQueries: [{ query: bookmarksQuerry }],
                })
              }
            >
              Delete Bookmark
            </button>
            <hr />
          </div>
        );
      })}
    </>
  );
};

export default IndexPage;
