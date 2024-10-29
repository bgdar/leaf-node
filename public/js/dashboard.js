document.addEventListener("DOMContentLoaded", function () {
  const cardLogin = document.querySelector(".card-login");
  document.querySelector("#login").addEventListener("click", () => {
    cardLogin.classList.toggle("active");
    blur.classList.add("active");
  });
  const blur = document.querySelector(".card-blur");
  blur.addEventListener("click", () => {
    cardLogin.classList.remove("active");
    cardLogin.style.transform = "translate(0%)";
    blur.classList.remove("active");
    cardSingin.classList.remove("active");
  });

  const cardSingin = document.querySelector(".card-singin");
  document.querySelector("#btn-singin").addEventListener("click", () => {
    if (cardSingin.classList.toggle("active")) {
      cardLogin.style.transform = "translate(-50%)";
    } else {
      cardLogin.style.transform = "translate(0%)";
    }
  });

  // bagina autentikasi pengiriman data untuk singin
  document.querySelector("#singin").addEventListener("submit", async () => {
    // ambil data inputan pengguna
    const name = document.querySelector("#signupName").value;
    const password = document.querySelector("#signupPassword").value;
    const email = document.querySelector("#email").value;
    const age = document.querySelector("#age").value;

    // kirim data ke server
    await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        age,
      }),
    });
    // bersihkan inputan
    document.querySelector("#signupName").value = "";
    document.querySelector("#signupPassword").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#age").value = "";
  });

  // card contact start

  document.querySelector(".card-contact").addEventListener("click", () => {
    cardContact.classList.toggle("active");
    blur.classList.add("active");
  });
  // card contact end

  const messageError = document
    .querySelector(".message")
    .getAttribute("pesanError");
  console.log(messageError);
  const messageSuccess = document
    .querySelector(".message")
    .getAttribute("pesanSuccess");
  console.log(messageSuccess);
  console.log(messageError);
  if (messageError) {
    Swal.fire({
      title: messageError,
      icon: "error",
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Okay",
      position: "top-end", // Posisikan alert di kanan atas
      backdrop: false,
      timer: 3000, // Menambahkan timeout 3 detik (3000 milidetik)
      timerProgressBar: true,
      customClass: {
        popup: "small-alert", // Kustom kelas CSS untuk ukuran kecil
      },
    });
  } else if (messageSuccess) {
    Swal.fire({
      title: messageSuccess,
      icon: "success",
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Okay",
      position: "top-end", // Posisikan alert di kanan atas
      backdrop: false,
      timer: 3000, // Menambahkan timeout 3 detik (3000 milidetik)
      timerProgressBar: true,
      customClass: {
        popup: "small-alert", // Kustom kelas CSS untuk ukuran kecil
      },
    });
  }

  // Animasi cursor
  const text = "Digital Green Space...";
  let index = 0;
  const typingText = document.querySelector(".typingText");
  function typeWrite() {
    if (index < text.length) {
      typingText.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWrite, 100);
    } else {
      // Setelah pengetikan selesai, jeda sebentar lalu ulangi animasi
      setTimeout(() => {
        resetText();
      }, 2000); // Jeda 2 detik sebelum animasi dimulai lagi
    }
  }
  function resetText() {
    if (index > 1) {
      typingText.innerHTML = text.substring(0, index - 1); // Hapus satu huruf dari akhir
      index--;
      setTimeout(resetText, 100); // Menghapus satu per satu
    } else {
      // Setelah semua teks terhapus, mulai ulang animasi pengetikan
      typeWrite(); // Jeda 1 detik sebelum mulai mengetik lagi
    }
  }
  typeWrite();
});
