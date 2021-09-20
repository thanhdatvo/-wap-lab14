$(function () {
  $("#send").click(loadUserInfo);
});
// loadUserInfo();
function loadUserInfo() {
  console.log("Hello2");
  var formData = $("#form")
    .serializeArray()
    .reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
//   formData = { userId: 1 };
  console.log(JSON.stringify(formData));
  $.ajax({
    url: `https://jsonplaceholder.typicode.com/users/${formData.userId}`,
    type: "GET",
    success: loadUserSuccess,
    error: ajaxFailure,
  });

  $.ajax({
    url: `https://jsonplaceholder.typicode.com/posts?userId=${formData.userId}`,
    type: "GET",
    success: loadPostsSuccess,
    error: ajaxFailure,
  });
}
function loadUserSuccess(data) {
  console.log(JSON.stringify(data));
  $("#name").html(data.name);
  $("#email").html(data.email);
  $("#address").html(
    data.address.street +
      " " +
      data.address.suite +
      " " +
      data.address.city +
      data.address.zipcode
  );
}

function loadPostsSuccess(data) {
  console.log(JSON.stringify(data));
  $("#posts").html("")
  data.forEach((post) => {
    $("#posts").append(`
        <p>Title: ${post.title} </p>
        <p>Body: ${post.body} </p>
        <button id="showComment${post.id}" data-attribute=${post.id}>Show comments</button>
        <div id="comments${post.id}" style="padding: 10px 30px"></div>
        </br>`);
    setTimeout(() => {
      $(`#showComment${post.id}`).on("click", ()=>loadCommentsForPost(post.id));
    }, 1000);
  });
}
function loadCommentsForPostSuccess(postId, data) {
  console.log(JSON.stringify(data));
  console.log('postId' + postId)
  data.forEach((comment) => {
    $(`#comments${postId}`).append(`
        <p>Name: ${comment.name} </p>
        <p>Body: ${comment.body} </p>
        <p>Email: ${comment.email} </p>
        </br>`);
  });
}

function loadCommentsForPost(postId) {
//   var postId = $(`#showComment${post.id}`).attr("data-attribute");
  console.log("postId" + postId);

  $.ajax({
    url: `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
    type: "GET",
    success: (data) => loadCommentsForPostSuccess(postId, data),
    error: ajaxFailure,
  });
}
function ajaxFailure(xhr, status, exception) {
  console.log(xhr, status, exception);
}

// $(".showComment").click(function (e) {
//     var postId = e.attr('data-attribute');
//     console.log('postId' + postId)
// });
