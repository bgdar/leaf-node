const komentartext = document.querySelector(".inputKomentar");
//tabgka data dari server yaitu user dan age
const user = document.querySelector(".user").getAttribute("user");
const age = document.querySelector(".age").getAttribute("age");

const boxHasilKomentar = document.getElementById("boxHasilKomentar");
function getNewComentar() {
  const komentarUser = document.createElement("div");
  komentarUser.classList.add("comentarUser");
  komentarUser.innerHTML = `
              <p class="age">${age}</p>
              <div class="row">
                <p id="TagName">${user}</p>
                <p id="textComentar">${komentartext.value}</p>
              </div>
                <div class="edit-comentar">
                <button  class="editBtn" id="editbtn">
                    <img src="icons/edit.png" title="edit" alt="edit-btn" />
                </button>
                <button  class="deleteBtn" date="<%= data.timestamp %>" id="deleteBtn">
                    <img src="icons/delete.png" title="delete" alt="delete btn" />
                </button>
            </div>`;
  boxHasilKomentar.appendChild(komentarUser);
}

const response = document.getElementById("response");
document.getElementById("btnAdd").addEventListener("click", function () {
  if (komentartext.value) {
    getNewComentar(); //tampilkan datanya terlebih dahulu saat di refres akan di ganti dgn data dari server
    fetch("/comentar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputKomentar: komentartext.value,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Tangani respon dari server
        response.textContent = result.message;

        response.style.marginTop = "10px";
        response.style.backgroundColor = "#388e3c";
        response.style.width = "100%";
      })
      .catch((error) => {
        response.style.color = "red";
        response.innerText = "Terjadi kesalahan, coba lagi.";
      });
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Isi dulu",
    });
  }
  komentartext.value = "";
});

//edit comentar
const boxEdit = document.querySelectorAll(".form-comentar");
const TomboEdit = document.querySelectorAll(".editBtn");
function kirimKeServer(newtext, date) {
  fetch(`/comentar/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: date,
      newtext,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "berhasil di edit silakan refress halamanya",
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan, coba lagi.",
      });
    });
}
TomboEdit.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    // Ambil kotak (box) yang sesuai dengan indeks tombol
    const box = boxEdit[index];
    if (box) {
      box.innerHTML = `
        <form id="editForm-${index}">
          <textarea name="newtext" id="textedit-${index}">${button.getAttribute(
        "komentar"
      )}</textarea>
         <p class="close"> X </p>
          <button type="submit">edit</button>
        </form>
      `;
      box.querySelector(".close").addEventListener("click", () => {
        box.innerHTML = "";
      });

      // Tambahkan event listener untuk submit form ini
      const editForm = document.getElementById(`editForm-${index}`);
      editForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Mencegah submit default
        const newText = document.getElementById(`textedit-${index}`).value;
        await kirimKeServer(newText, button.getAttribute("date")); // Kirim nilai textarea ke fungsi
      });
    }
  });
});

//delete comentar
document.querySelectorAll("#deleteBtn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const date = button.getAttribute("date");
    Swal.fire({
      title: "delete you omentar ",
      text: "This action cannot be undone!",
      icon: "warning",
      width: "300px", // Ukuran popup lebih kecil
      padding: "1rem", // Padding minimal
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // kirim data ke server
        fetch(`/comentar/${date}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: true, // Kirim data delete ke server
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            // Tangani respon dari server
            response.textContent = result.message;
            response.style.color = "green";
          })
          .catch((error) => {
            response.textContent = error;
            response.style.color = "red";
          });

        // Hapus element yang diedit di sini
        const comentarUser = document.querySelector(".comentarUser");
        boxHasilKomentar.removeChild(comentarUser);
        // Tambahkan aksi delete di sini
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your item has been deleted.",
          width: "300px", // Ukuran popup tetap minimalis
          padding: "1rem",
          showConfirmButton: false,
          timer: 1500, // Menutup otomatis setelah 1,5 detik
        });
      }
    });
  });
});
