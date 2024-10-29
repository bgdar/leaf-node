document.addEventListener("DOMContentLoaded", () => {
  //Card logout satrt
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", () => {
    Swal.fire({
      title: "Logout?",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/logout";
      }
    });
  });

  //Card logout end

  //pesan server
  const messageSuccess = document.querySelector(".home").getAttribute("pesan");
  if (messageSuccess) {
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
      title: messageSuccess,
    });
  }
});

// detals logo star
document.querySelectorAll("#btn-detail").forEach((button) => {
  button.addEventListener("click", (e) => {
    const span = e.target.closest("span");

    const author = span.getAttribute("author");
    const year = span.getAttribute("year");
    const desc = span.getAttribute("desc");
    const logo = span.getAttribute("logo");
    const title = span.querySelector("title");

    Swal.fire({
      title: title,
      html: `
      <div style="
        border-radius: 10px; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
        padding: 20px; 
        background-color: #fff;
        text-align: center;
      ">
        <img src="${logo}" alt="Logo" style="max-width: 100%; height: auto; margin-bottom: 20px; border-radius: 8px;">
        <h3 style="margin: 10px 0;">Author: ${author}</h3>
        <h4 style="margin: 5px 0; color: #888;">Year: ${year}</h4>
        <p style="color: #333;">${desc}</p>
      </div>
    `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fas fa-thumbs-up"></i> Ok',
      background: "#f9f9f9", // Memberikan warna latar belakang yang lebih terang
      width: "400px", // Mengatur lebar card agar lebih kompak seperti card
    });
  });
});
// detai logo end
