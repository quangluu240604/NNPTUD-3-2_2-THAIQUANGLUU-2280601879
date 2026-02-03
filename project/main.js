async function getData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById('table_body');

        body.innerHTML = posts.map(post => {
            const s1 = post.isDeleted ? "<s>" : "";
            const s2 = post.isDeleted ? "</s>" : "";

            return `
                <tr>
                    <td>${s1}${post.id}${s2}</td>
                    <td>${s1}${post.title}${s2}</td>
                    <td>${s1}${post.views}${s2}</td>
                    <td>
                        ${
                            post.isDeleted
                                ? `<button class="btn btn-secondary btn-sm" onclick="Restore(${post.id})">Khôi phục</button>`
                                : `<button class="btn btn-danger btn-sm" onclick="Delete(${post.id})">Xóa mềm</button>`
                        }
                    </td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.log(error);
    }
}

async function Save() {
    let title = document.getElementById('txt_title').value;
    let views = document.getElementById('txt_views').value;

    if (title.trim() === "" || views.trim() === "") {
        alert("Vui lòng nhập đầy đủ dữ liệu!");
        return;
    }

    // Lấy danh sách để tính maxId
    let res = await fetch('http://localhost:3000/posts');
    let posts = await res.json();

    let maxId = posts.length > 0 ? Math.max(...posts.map(p => Number(p.id))) : 0;

    let newId = maxId + 1;

    // Tạo bài mới
    let createRes = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: newId,
            title,
            views,
            isDeleted: false
        })
    });

    if (createRes.ok) {
        console.log("Tạo mới thành công");
        getData();
    }
}

async function Delete(id) {
    let res = await fetch('http://localhost:3000/posts/' + id);
    let post = await res.json();

    post.isDeleted = true;

    let update = await fetch('http://localhost:3000/posts/' + id, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post)
    });

    if (update.ok) {
        console.log("Xóa mềm thành công");
        getData();
    }
}

async function Restore(id) {
    let res = await fetch('http://localhost:3000/posts/' + id);
    let post = await res.json();

    post.isDeleted = false;

    let update = await fetch('http://localhost:3000/posts/' + id, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post)
    });

    if (update.ok) {
        console.log("Khôi phục thành công");
        getData();
    }
}

getData();
