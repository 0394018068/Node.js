const API_POST = "http://localhost:3000/posts";
const API_COMMENT = "http://localhost:3000/comments";

document.addEventListener("DOMContentLoaded", loadPosts);

/* ================= POST ================= */

function loadPosts() {
    fetch(API_POST)
        .then(res => res.json())
        .then(data => {
            renderPosts(data.filter(p => !p.deleted));
            renderTrash(data.filter(p => p.deleted));
        });
}

function renderPosts(posts) {
    const tbody = document.getElementById("postTable");
    tbody.innerHTML = "";

    posts.forEach(p => {
        tbody.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.title}</td>
            <td>${p.views}</td>
            <td>
                <button onclick="editPost(${p.id})">✏️</button>
                <button onclick="openComments(${p.id})">💬</button>
                <button onclick="deletePost(${p.id})">🗑</button>
            </td>
        </tr>
        `;
    });
}

function renderTrash(posts) {
    const div = document.getElementById("trashList");
    div.innerHTML = "";

    posts.forEach(p => {
        div.innerHTML += `
        <div class="trash-item">
            ${p.title}
            <button onclick="restorePost(${p.id})">♻️</button>
        </div>
        `;
    });
}

function savePost() {
    const id = document.getElementById("postId").value;
    const title = document.getElementById("postTitle").value;
    const views = Number(document.getElementById("postViews").value);

    if (!title) {
        alert("Vui lòng nhập tiêu đề!");
        return;
    }

    const post = { title, views, deleted: false };

    if (id) {
        fetch(`${API_POST}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post)
        }).then(() => loadPosts());
    } else {
        fetch(API_POST, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post)
        }).then(() => loadPosts());
    }

    resetPostForm();
}

function editPost(id) {
    fetch(`${API_POST}/${id}`)
        .then(res => res.json())
        .then(p => {
            postId.value = p.id;
            postTitle.value = p.title;
            postViews.value = p.views;
        });
}

function deletePost(id) {
    fetch(`${API_POST}/${id}`)
        .then(res => res.json())
        .then(p => {
            p.deleted = true;
            fetch(`${API_POST}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(p)
            }).then(() => loadPosts());
        });
}

function restorePost(id) {
    fetch(`${API_POST}/${id}`)
        .then(res => res.json())
        .then(p => {
            p.deleted = false;
            fetch(`${API_POST}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(p)
            }).then(() => loadPosts());
        });
}

function resetPostForm() {
    postId.value = "";
    postTitle.value = "";
    postViews.value = "";
}

/* ================= COMMENT ================= */

function openComments(postId) {
    fetch(`${API_POST}/${postId}`)
        .then(res => res.json())
        .then(post => {
            document.getElementById("commentModal").style.display = "flex";
            document.getElementById("currentPostId").value = postId;
            document.getElementById("commentTitle").innerText = post.title;
            loadComments(postId);
        });
}

function closeComments() {
    document.getElementById("commentModal").style.display = "none";
}

function loadComments(postId) {
    fetch(`${API_COMMENT}?postId=${postId}`)
        .then(res => res.json())
        .then(data => {
            const ul = document.getElementById("commentList");
            ul.innerHTML = "";
            data.forEach(c => {
                ul.innerHTML += `
                <li>
                    ${c.content}
                    <button onclick="editComment(${c.id}, '${c.content}')">✏️</button>
                    <button onclick="deleteComment(${c.id})">❌</button>
                </li>
                `;
            });
        });
}

function saveComment() {
    const postId = currentPostId.value;
    const content = commentText.value;
    const id = commentId.value;

    if (!content) return;

    const cmt = { postId, content };

    if (id) {
        fetch(`${API_COMMENT}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cmt)
        }).then(() => loadComments(postId));
    } else {
        fetch(API_COMMENT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cmt)
        }).then(() => loadComments(postId));
    }

    commentText.value = "";
    commentId.value = "";
}

function editComment(id, content) {
    commentId.value = id;
    commentText.value = content;
}

function deleteComment(id) {
    fetch(`${API_COMMENT}/${id}`, { method: "DELETE" })
        .then(() => loadComments(currentPostId.value));
}