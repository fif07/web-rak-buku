
const buku = [];

const RENDER_EVENT = "ubah-buku";
const SAVED_EVENT = "simpan-buku";
const MOVED_EVENT = "pindah-buku";
const DELETED_EVENT = "hapus-buku";
const STORAGE_KEY = "APPS_RAKBUKU";

function isSupportWebStorage () {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung web storage");
      return false;
    }
    return true;
};

function generateBookId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

function findBook (idBuku) {
    for (const itemBuku of buku) {
      if (itemBuku.id === idBuku) {
        return itemBuku;
      }
    }
  
    return null;
};

function findBookIndex (idBuku) {
    for (const indeksBuku in buku) {
      if (buku[indeksBuku].id === idBuku) {
        return indeksBuku;
      }
    }
  
    return -1;
};

function getDataWebStorage() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const item of data) {
      buku.push(item);
    }
  }
  
  document.dispatchEvent(new Event(RENDER_EVENT));
};

function makeBookElement (objekBuku) {
  const elemenJudulBuku = document.createElement("p");
  elemenJudulBuku.classList.add("itemJudul");
  elemenJudulBuku.innerHTML = `${objekBuku.title} <span>(${objekBuku.year})</span>`;

  const elemenPenulisBuku = document.createElement("p");
  elemenPenulisBuku.classList.add("itemPenulis");
  elemenPenulisBuku.innerText = objekBuku.author;

  const wadahPenulisDanJudul = document.createElement("div");
  wadahPenulisDanJudul.classList.add("itemPenulisDanJudul-");
  wadahPenulisDanJudul.append(elemenJudulBuku, elemenPenulisBuku);

  const wadahTombolAksi = document.createElement("div");
  wadahTombolAksi.classList.add("itemTombolAksi");

  const wadah = document.createElement("div");
  wadah.classList.add("itemWadah");
  wadah.append(wadahPenulisDanJudul);
  wadah.setAttribute("id", `book-${objekBuku.id}`);

  if (objekBuku.isComplete) {
    const tombolUlang = document.createElement("button");
    tombolUlang.classList.add("tombolBalik");
    tombolUlang.innerText = "Batal";

    tombolUlang.addEventListener("click", function () {
      returnBookFromFinished(objekBuku.id);
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.classList.add("tombolHapus");
    tombolHapus.innerText = "Hapus";

    tombolHapus.addEventListener("click", function () {
      deleteBook(objekBuku.id);
    });

    wadahTombolAksi.append(tombolUlang, tombolHapus);
    wadah.append(wadahTombolAksi);
  } else {
    const tombolSelesai = document.createElement("button");
    tombolSelesai.classList.add("tombolSelesai");
    tombolSelesai.innerText = "Selesai";

    tombolSelesai.addEventListener("click", function () {
      addBookToFinished(objekBuku.id);
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.classList.add("tombolHapus");
    tombolHapus.innerText = "Hapus";

    tombolHapus.addEventListener("click", function () {
      deleteBook(objekBuku.id);
    });

    wadahTombolAksi.append(tombolSelesai, tombolHapus);
    wadah.append(wadahTombolAksi);
  }

  return wadah;
};

document.addEventListener(RENDER_EVENT, function () {
    const bukuBelumDibaca = document.getElementById("bukuBelumDibaca");
    bukuBelumDibaca.innerHTML = "";
  
    const bukuSudahDibaca = document.getElementById("bukuSudahDibaca");
    bukuSudahDibaca.innerHTML = "";
  
    for (const itemBuku of buku) {
      const bookElement = makeBookElement(itemBuku);
      if (!itemBuku.isComplete) {
        bukuBelumDibaca.append(bookElement);
      } else {
        bukuSudahDibaca.append(bookElement);
      }
    }
});

document.addEventListener(SAVED_EVENT, function () {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("notif");
    elementCustomAlert.innerText = "Berhasil Disimpan";
  
    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(function () {
      elementCustomAlert.remove();
    }, 2000);
  });
  
  document.addEventListener(MOVED_EVENT, function () {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("notif");
    elementCustomAlert.innerText = "Berhasil Dipindahkan";
  
    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(function () {
      elementCustomAlert.remove();
    }, 2000);
  });
  
  document.addEventListener(DELETED_EVENT, function () {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("notif");
    elementCustomAlert.innerText = "Berhasil Dihapus";
  
    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(function () {
      elementCustomAlert.remove();
    }, 2000);
});
  
function deleteBookData () {
    if (isSupportWebStorage()) {
      const parsed = JSON.stringify(buku);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(DELETED_EVENT));
    }
};

function moveBookData () {
  if (isSupportWebStorage()) {
    const parsed = JSON.stringify(buku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(MOVED_EVENT));
  }
};

function saveBookData () {
  if (isSupportWebStorage()) {
    const parsed = JSON.stringify(buku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

function addBook () {
    let statusBuku;

    const judulBuku = document.getElementById("judulBuku");
    const penulisBuku = document.getElementById("penulisBuku");
    const tahunBuku = document.getElementById("tahunBuku");
    const sudahDibaca = document.getElementById("sudahDibaca");
    
    if (sudahDibaca.checked) {
      statusBuku = true;
    } else {
      statusBuku = false;
    }
    
    const idBuku = generateBookId();
    let hasilObjekBuku = generateBookObject(idBuku, judulBuku.value, penulisBuku.value, Number(tahunBuku.value), statusBuku);
    buku.push(hasilObjekBuku);

    judulBuku.value = null;
    penulisBuku.value = null;
    tahunBuku.value = null;
    sudahDibaca.checked = false;


    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
};

function addBookToFinished (idBuku) {
    const targetBuku = findBook(idBuku);
  
    if (targetBuku == null) return;
  
    targetBuku.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveBookData();
};

function returnBookFromFinished (idBuku) {
    const targetBuku = findBook(idBuku);
  
    if (targetBuku == null) return;
  
    targetBuku.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveBookData();
};

function deleteBook (idBuku) {
    const targetBuku = findBookIndex(idBuku);
  
    if (targetBuku === -1) return;
  
    buku.splice(targetBuku, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteBookData();
};

function searchBook () {
  const inputCari = document.getElementById("inputCari").value.toLowerCase();
  const itemWadah = document.getElementsByClassName("itemWadah");

  for (let i = 0; i < itemWadah.length; i++) {
    const itemJudul = itemWadah[i].querySelector(".itemJudul");
    if (itemJudul.textContent.toLowerCase().includes(inputCari)) {
      itemWadah[i].classList.remove("umpet");
    } else {
      itemWadah[i].classList.add("umpet");
    }
  }
};

document.addEventListener("DOMContentLoaded", function () {
    if (isSupportWebStorage()) {
      getDataWebStorage();
    }
  
    const simpanForm = document.getElementById("formInputBuku");
    simpanForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
    });
  
    const cariForm = document.getElementById("formCariBuku");
    cariForm.addEventListener("submit", function (event) {
      event.preventDefault();
      searchBook();
    });
});
