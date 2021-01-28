import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
const bookmarksQuerry = gql`
  {
    bookmarks {
      URL
      Description
      DateCreated
      Id
      Name
    }
  }
`;
const addBookmarkMutation = gql`
  mutation addBookmark(
    $URL: String
    $Description: String
    $DateCreated: String
    $Id: String
    $Name: String
  ) {
    addBookmark(
      URL: $URL
      Description: $Description
      DateCreated: $DateCreated
      Id: $Id
      Name: $Name
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
  const [linkName, setLinkName] = React.useState("");
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error...?</h1>;
  }
  console.log("Data===>", data);
  return (
    <div className="min-h-screen bg-Finn text-blue">
      {/* Heading */}
      <div className=" p-5 text-4xl text-white font-bold">Bookmark App</div>
      {/* Input Field */}
      <div className=" border-white border-4 md:w-1/2 flex justify-center items-center mx-2 p-3 md:mx-auto">
        <div className="w-full md:mx-5 ">
          <input
            value={linkName}
            className="sm:p-5 w-full p-2"
            placeholder="What do You Want to Call it?"
            onChange={(e)=>setLinkName(e.target.value)}
          />
          <br />
          <br />
          <input
            value={link}
            className="sm:p-5 w-full p-2"
            placeholder="Enter Your Website Link"
            onChange={(e)=>setLink(e.target.value)}
          />
          <br />
          <br />
          <textarea
            value={desc}
            rows="8"
            cols="40"
            className=" sm:p-5 w-full p-2"
            placeholder="Enter Your Website Link"
            onChange={(e)=>setDesc(e.target.value)}
          />
          <button
            className="px-9 py-3  mt-2 text-white bg-yellow-600 rounded-3xl"
            onClick={() => {
              let date = new Date();
              addBookmark({
                variables: {
                  URL: link,
                  Description: desc,
                  DateCreated: JSON.stringify(date.getDate()),
                  Name: linkName,
                },
                refetchQueries: [{ query: bookmarksQuerry }],
              });
              setLink("");
              setDesc("");
              setLinkName("");
            }}
          >
            Add Bookmark
          </button>
        </div>
      </div>
      {/* Bookmark Cards */}
      {data.bookmarks?.map((bookmark) => {
        return (
          <div className="mt-10 flex justify-center w-full items-center py-5">
            <div className="bg-yellow-100 md:w-3/5 p-5 mx-3">
              <div className="flex justify-between">
                <div className="flex">
                  <div>
                    <p className="bg-purple-400 inline-block rounded-full px-2 py-1 mr-2 text-lg ">
                      {bookmark.Name.charAt(0)}
                    </p>
                  </div>
                  <div className="text-lg">
                    <p> {bookmark.Name}</p>
                    <p> {bookmark.URL}</p>
                    <p> {bookmark.DateCreated}</p>
                  </div>
                </div>
                <p
                  className="text-xl font-bold hover:text-red-700 cursor-pointer"
                  onClick={() =>
                    deleteBookmark({
                      variables: {
                        Id: bookmark.Id,
                      },
                      refetchQueries: [{ query: bookmarksQuerry }],
                    })
                  }
                >
                  X
                </p>
              </div>
              <div className="mt-3">{bookmark.Description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IndexPage;
