const ApiKey = "123456";
const baseUrl = "http://localhost:8080/rest_server_toko_komputer/index.php/";
const userEndPoin = `${baseUrl}user/`;
const produkEndPoin = `${baseUrl}produk/`;
const kategoriEndPoin = `${baseUrl}kategori/`;
const brandEndPoin = `${baseUrl}brand/`;

const contents = document.querySelector(".isi");
const title = document.querySelector(".judul");
const get_config = {
    headers: {
        'X-Api-Key': ApiKey
    }
};

function loadPage(page) {
    switch (page) {
        case "user":
            getUser();
            break;
        case "addUser":
            addUser();
            break;
        case "produk":
            getProduk();
            break;
        case "addProduk":
            addProduk();
            break;
        case "kategori":
            getKategori();
            break;
        case "addKategori":
            addKategori();
            break;
        case "brand":
            getBrand();
            break;
        case "addBrand":
            addBrand();
            break;
        case "home":
            home();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll("a").forEach(elm => {
        elm.addEventListener("click", evt => {
            page = evt.target.getAttribute("href").substr(1);
            index = page.indexOf("?");
            if (index!=-1) page = page.substr(0, index);
            loadPage(page);
        })
    })

    var page = window.location.hash.substr(1);
    index = page.indexOf("?");
    if (index!=-1) page = page.substr(0, index);
    if (page === "" || page === "!") page = "home";
    loadPage(page);
});

function home() {
    title.innerHTML="<h2>REST CLIENT TOKO KOMPUTER</h2>";
    contents.innerHTML= `
    <h5>WEBSERVICE PROGRAMMING</h5>
    <h5>Natasya Liemena / 311910012</h5>
    `
}

//USER================================================================================
function getUser() {
    title.innerHTML="<h2>Daftar Customer</h2>";

    var url_string = window.location.href;
    index = url_string.indexOf("?");
    console.log(url_string);
    
    var userEndPoin2 = userEndPoin;
    var no=1;

    if (index!=-1) {
        var page = url_string.substring(index+6);
        console.log(page)
        userEndPoin2 = `${baseUrl}user?page=${page}`;
        no=-9+(10*page);
    }

    fetch(userEndPoin2, get_config)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.data)
            let users = "";
            
            resJson.data.forEach(user => {
                users += `
                <tr>
                <th scope="row">${no}</th>
                <td>${user.nama_user}</td>
                <td>${user.alamat_user}</td>
                <td>${user.nomor_user}</td>
                <td>
                    <a class="btn btn-warning" href="#editUser" onclick="javascript:editUser(${user.id_user})">Edit</a>
                    <a class="btn btn-danger" href="#deleteUser" onclick="javascript:deleteUser(${user.id_user})">Delete</a>
                </td>
                </tr>          
                `;
                no++;
            });

            let pagination="";

            for (let i = 0; i < resJson.total_page; i++) {
                pagination+= `<li class="page-item"><a class="page-link" href="http://localhost:8080/rest_client_toko_komputer#user?page=${i+1}">${i+1}</a></li>`
            }

            contents.innerHTML = `
            <a class="btn btn-primary" href="#addUser" onclick="return loadPage('addUser')" style="float: right">Tambah User</a>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Nama</th>
                    <th scope="col">Alamat</th>
                    <th scope="col">No Hp</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${users}
                </tbody>
            </table>
            <ul class="pagination">
                ${pagination}
            </ul>
            `

        }).catch(err => {
            console.error(err);
        })
}

function addUser() {
    title.innerHTML="<h2>Menambahkan User</h2>";
    contents.innerHTML=`
        <form id="myForm" action="javascript:addingUser()" method="post">
            <div class="mb-3">
                <label for="nama" class="form-label">Nama : </label>
                <input type="text" class="form-control" id="nama" name="nama" placeholder="Nama"> 
            </div>

            <div class="mb-3">
                <label for="alamat" class="form-label">Alamat : </label>
                <input type="text" class="form-control" id="alamat" name="alamat" placeholder="Alamat"> 
            </div>

            <div class="mb-3">
                <label for="nomor" class="form-label">Nomor HP : </label>
                <input type="text" class="form-control" id="nomor" name="nomor" placeholder="Nomor"> 
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    `
}

function addingUser() {
    title.innerHTML="<h2>Menambahkan User</h2>";
    var nama= document.getElementById("nama").value;
    var alamat= document.getElementById("alamat").value;
    var nomor= document.getElementById("nomor").value;
    console.log(nama);
    //https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
    fetch(userEndPoin, {
        method: "POST",
        
        body: new URLSearchParams({
            'nama': nama,
            'alamat': alamat,
            'nomor': nomor
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        loadPage('user')

    }).catch(err => {
        console.error(err);
    })
}

function editUser(id) {
    title.innerHTML="<h2>Edit Customer</h2>";
    const userDetEndPoin = `${baseUrl}user/?id_user=${id}`;
    fetch(userDetEndPoin, get_config)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.data)
            contents.innerHTML = `
            <form id="editUserForm" action="javascript:editingUser(${id})" method="post">
                <div class="mb-3">
                    <label for="nama" class="form-label">Nama : </label>
                    <input type="text" class="form-control" id="nama" name="nama" placeholder="Nama" value="${resJson.data[0].nama_user}"> 
                </div>

                <div class="mb-3">
                    <label for="alamat" class="form-label">Alamat : </label>
                    <input type="text" class="form-control" id="alamat" name="alamat" placeholder="Alamat" value="${resJson.data[0].alamat_user}"> 
                </div>

                <div class="mb-3">
                    <label for="nomor" class="form-label">Nomor HP : </label>
                    <input type="text" class="form-control" id="nomor" name="nomor" placeholder="Nomor" value="${resJson.data[0].nomor_user}"> 
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            `

        }).catch(err => {
            console.error(err);
        })
}

function editingUser(id) {
    title.innerHTML="<h2>Edit Customer</h2>";
    var nama= document.getElementById("nama").value;
    var alamat= document.getElementById("alamat").value;
    var nomor= document.getElementById("nomor").value;
    console.log(nama);
    //https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
    fetch(userEndPoin, {
        method: "PUT",
        
        body: new URLSearchParams({
            'nama': nama,
            'alamat': alamat,
            'nomor': nomor,
            'id_user' : id
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        location.href="#user"
        loadPage('user')

    }).catch(err => {
        console.error(err);
    })
}

function deleteUser(id) {
    fetch(userEndPoin, {
        method: "DELETE",
        
        body: new URLSearchParams({
            'id_user' : id
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        location.href="#user"
        loadPage('user')

    }).catch(err => {
        console.error(err);
    })
}

//KATEGORI ==================================================================================
function getKategori() {
    title.innerHTML="<h2>Daftar Kategori</h2>";

    var url_string = window.location.href;
    index = url_string.indexOf("?");
    console.log(url_string);
    
    var kategoriEndPoin2 = kategoriEndPoin;
    var no=1;

    if (index!=-1) {
        var page = url_string.substring(index+6);
        console.log(page)
        kategoriEndPoin2 = `${baseUrl}kategori?page=${page}`;
        no=-9+(10*page);
    }

    fetch(kategoriEndPoin2, get_config)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.data)
            let kategoris = "";
            
            resJson.data.forEach(kategori => {
                kategoris += `
                <tr>
                <th scope="row">${no}</th>
                <td>${kategori.nama_kategori}</td>
                <td>
                    <a class="btn btn-warning" href="#editKategori" onclick="javascript:editKategori(${kategori.id_kategori})">Edit</a>
                </td>
                </tr>
                `;
                no++;
            });

            let pagination="";

            for (let i = 0; i < resJson.total_page; i++) {
                pagination+= `<li class="page-item"><a class="page-link" href="http://localhost:8080/rest_client_toko_komputer#kategori?page=${i+1}">${i+1}</a></li>`
            }

            contents.innerHTML = `
            <a class="btn btn-primary" href="#addKategori" onclick="return loadPage('addKategori')" style="float: right">Tambah Kategori</a>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Kategori</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${kategoris}
                </tbody>
            </table>
            <ul class="pagination">
                ${pagination}
            </ul>
            `

        }).catch(err => {
            console.error(err);
        })
}

function addKategori() {
    title.innerHTML="<h2>Menambahkan Kategori</h2>";
    contents.innerHTML=`
        <form id="myForm" action="javascript:addingKategori()" method="post">
            <div class="mb-3">
                <label for="kategori" class="form-label">Kategori : </label>
                <input type="text" class="form-control" id="kategori" name="kategori" placeholder="kategori"> 
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    `
}

function addingKategori() {
    title.innerHTML="<h2>Menambahkan Kategori</h2>";
    var kategori= document.getElementById("kategori").value;
    console.log(kategori);
    //https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
    fetch(kategoriEndPoin, {
        method: "POST",
        
        body: new URLSearchParams({
            'kategori': kategori
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        loadPage('kategori')

    }).catch(err => {
        console.error(err);
    })
}

function editKategori(id) {
    title.innerHTML="<h2>Edit Kategori</h2>";
    const kategoriDetEndPoin = `${baseUrl}kategori/?id_kategori=${id}`;
    fetch(kategoriDetEndPoin, get_config)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.data)
            contents.innerHTML = `
            <form id="editKategoriForm" action="javascript:editingKategori(${id})" method="post">
                <div class="mb-3">
                    <label for="kategori" class="form-label">kategori : </label>
                    <input type="text" class="form-control" id="kategori" name="kategori" placeholder="kategori" value="${resJson.data[0].nama_kategori}"> 
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            `

        }).catch(err => {
            console.error(err);
        })
}

function editingKategori(id) {
    title.innerHTML="<h2>Edit Kategori</h2>";
    var kategori= document.getElementById("kategori").value;
    console.log(kategori);
    //https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
    fetch(kategoriEndPoin, {
        method: "PUT",
        
        body: new URLSearchParams({
            'kategori': kategori,
            'id_kategori' : id
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        location.href="#kategori"
        loadPage('kategori')

    }).catch(err => {
        console.error(err);
    })
}


//BRAND ==================================================================================
function getBrand() {
    title.innerHTML="<h2>Daftar brand</h2>";

    var url_string = window.location.href;
    index = url_string.indexOf("?");
    console.log(url_string);
    
    var brandEndPoin2 = brandEndPoin;
    var no=1;

    if (index!=-1) {
        var page = url_string.substring(index+6);
        console.log(page)
        brandEndPoin2 = `${baseUrl}brand?page=${page}`;
        no=-9+(10*page);
    }

    fetch(brandEndPoin2, get_config)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.data)
            let brands = "";
            
            resJson.data.forEach(brand => {
                brands += `
                <tr>
                <th scope="row">${no}</th>
                <td>${brand.nama_brand}</td>
                <td>
                    <a class="btn btn-warning" href="#editbrand" onclick="javascript:editBrand(${brand.id_brand})">Edit</a>
                </td>
                </tr>
                `;
                no++;
            });

            let pagination="";

            for (let i = 0; i < resJson.total_page; i++) {
                pagination+= `<li class="page-item"><a class="page-link" href="http://localhost:8080/rest_client_toko_komputer#brand?page=${i+1}">${i+1}</a></li>`
            }

            contents.innerHTML = `
            <a class="btn btn-primary" href="#addBrand" onclick="return loadPage('addBrand')" style="float: right">Tambah Brand</a>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${brands}
                </tbody>
            </table>
            <ul class="pagination">
                ${pagination}
            </ul>
            `

        }).catch(err => {
            console.error(err);
        })
}

function addBrand() {
    title.innerHTML="<h2>Menambahkan brand</h2>";
    contents.innerHTML=`
        <form id="myForm" action="javascript:addingBrand()" method="post">
            <div class="mb-3">
                <label for="brand" class="form-label">brand : </label>
                <input type="text" class="form-control" id="brand" name="brand" placeholder="brand"> 
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    `
}

function addingBrand() {
    title.innerHTML="<h2>Menambahkan Brand</h2>";
    var brand= document.getElementById("brand").value;
    console.log(brand);
    //https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
    fetch(brandEndPoin, {
        method: "POST",
        
        body: new URLSearchParams({
            'brand': brand
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        loadPage('brand')

    }).catch(err => {
        console.error(err);
    })
}

function editBrand(id) {
    title.innerHTML="<h2>Edit brand</h2>";
    const brandDetEndPoin = `${baseUrl}brand/?id_brand=${id}`;
    fetch(brandDetEndPoin, get_config)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.data)
            contents.innerHTML = `
            <form id="editbrandForm" action="javascript:editingBrand(${id})" method="post">
                <div class="mb-3">
                    <label for="brand" class="form-label">Brand : </label>
                    <input type="text" class="form-control" id="brand" name="brand" placeholder="brand" value="${resJson.data[0].nama_brand}"> 
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            `

        }).catch(err => {
            console.error(err);
        })
}

function editingBrand(id) {
    title.innerHTML="<h2>Edit brand</h2>";
    var brand= document.getElementById("brand").value;
    console.log(brand);
    //https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
    fetch(brandEndPoin, {
        method: "PUT",
        
        body: new URLSearchParams({
            'brand': brand,
            'id_brand' : id
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        location.href="#brand"
        loadPage('brand')

    }).catch(err => {
        console.error(err);
    })
}

//PRODUK ======================================================================================
function getProduk() {
    title.innerHTML="<h2>Daftar Produk</h2>";

    var url_string = window.location.href;
    index = url_string.indexOf("?");
    console.log(url_string);
    
    var produkEndPoin2 = produkEndPoin;
    var no=1;

    if (index!=-1) {
        var page = url_string.substring(index+6);
        console.log(page)
        produkEndPoin2 = `${baseUrl}produk?page=${page}`;
        no=-9+(10*page);
    }

    fetch(produkEndPoin2, get_config)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.data)
            let produks = "";
            
            resJson.data.forEach(produk => {
                produks += `
                <tr>
                <th scope="row">${no}</th>
                <td>${produk.nama_produk}</td>
                <td>${produk.spesifikasi}</td>
                <td>${produk.harga}</td>
                <td>${produk.stok}</td>
                <td>${produk.nama_kategori}</td>
                <td>${produk.nama_brand}</td>
                <td>
                    <a class="btn btn-warning" href="#editProduk" onclick="javascript:editProduk(${produk.id_produk})">Edit</a>
                    <a class="btn btn-danger" href="#deleteProduk" onclick="javascript:deleteProduk(${produk.id_produk})">Delete</a>
                </td>
                </tr>          
                `;
                no++;
            });

            let pagination="";

            for (let i = 0; i < resJson.total_page; i++) {
                pagination+= `<li class="page-item"><a class="page-link" href="http://localhost:8080/rest_client_toko_komputer#produk?page=${i+1}">${i+1}</a></li>`
            }

            contents.innerHTML = `
            <a class="btn btn-primary" href="#addProduk" onclick="return loadPage('addProduk')" style="float: right">Tambah Produk</a>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Produk</th>
                    <th scope="col">Spesifikasi</th>
                    <th scope="col">Harga</th>
                    <th scope="col">Stok</th>
                    <th scope="col">Kategori</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${produks}
                </tbody>
            </table>
            <ul class="pagination">
                ${pagination}
            </ul>
            `

        }).catch(err => {
            console.error(err);
        })
}

async function addProduk() {
    title.innerHTML="<h2>Menambahkan Produk</h2>";

    // var brands = "";
    // var kategoris = "";

    let brands = await fetch(brandEndPoin, get_config)
        .then(response => response.json())
        .then(resJson => {
            let brandss ="";
            resJson.data.forEach(brand => {
                brandss += `
                <option value="${brand.id_brand}">${brand.nama_brand}</option>
                `
                console.log(brandss);
            })
            return brandss;

        }).catch(err => {
            console.error(err);
        })
    
    console.log(brands);
    
    let kategoris = await fetch(kategoriEndPoin, get_config)
        .then(response => response.json())
        .then(resJson => {
            let kategoriss = "";
            resJson.data.forEach(kategori => {
                kategoriss += `
                <option value="${kategori.id_kategori}">${kategori.nama_kategori}</option>
                `
                
            })
            return kategoriss;
        }).catch(err => {
            console.error(err);
        })
    
    console.log(kategoris);

    contents.innerHTML=`
        <form id="myForm" action="javascript:addingProduk()" method="post">
            <div class="mb-3">
                <label for="nama" class="form-label">Nama : </label>
                <input type="text" class="form-control" id="nama" name="nama" placeholder="Nama"> 
            </div>

            <div class="mb-3">
                <label for="kategori" class="form-label">Kategori : </label>
                <select id="kategori" name="Kategori" form="myForm">
                    ${kategoris}
                </select>    
            </div>

            <div class="mb-3">
                <label for="brand" class="form-label">Brand : </label>
                <select id="brand" name="brand" form="myForm">
                    ${brands}
                </select>
            </div>

            <div class="mb-3">
                <label for="harga" class="form-label">Harga : </label>
                <input type="text" class="form-control" id="harga" name="harga" placeholder="harga"> 
            </div>

            <div class="mb-3">
                <label for="stok" class="form-label">stok : </label>
                <input type="text" class="form-control" id="stok" name="stok" placeholder="stok"> 
            </div>

            <div class="mb-3">
                <label for="spesifikasi" class="form-label">spesifikasi : </label>
                <input type="text" class="form-control" id="spesifikasi" name="spesifikasi" placeholder="spesifikasi"> 
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    `
}

function addingProduk() {
    title.innerHTML="<h2>Menambahkan Produk</h2>";
    var nama= document.getElementById("nama").value;
    var kategori= document.getElementById("kategori").value;
    var brand= document.getElementById("brand").value;
    var harga= document.getElementById("harga").value;
    var stok= document.getElementById("stok").value;
    var spesifikasi= document.getElementById("spesifikasi").value;
    console.log(nama);
    //https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
    fetch(produkEndPoin, {
        method: "POST",
        
        body: new URLSearchParams({
            'nama': nama,
            'kategori': kategori,
            'brand': brand,
            'harga': harga,
            'stok': stok,
            'spesifikasi': spesifikasi
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        loadPage('produk')

    }).catch(err => {
        console.error(err);
    })
}

async function editProduk(id) {
    title.innerHTML="<h2>Edit Produk</h2>";
    const produkDetEndPoin = `${baseUrl}produk/?id_produk=${id}`;

    let brands = await fetch(brandEndPoin, get_config)
        .then(response => response.json())
        .then(resJson => {
            let brandss ="";
            resJson.data.forEach(brand => {
                brandss += `
                <option value="${brand.id_brand}">${brand.nama_brand}</option>
                `
                console.log(brandss);
            })
            return brandss;

        }).catch(err => {
            console.error(err);
        })
    
    console.log(brands);
    
    let kategoris = await fetch(kategoriEndPoin, get_config)
        .then(response => response.json())
        .then(resJson => {
            let kategoriss = "";
            resJson.data.forEach(kategori => {
                kategoriss += `
                <option value="${kategori.id_kategori}">${kategori.nama_kategori}</option>
                `
                
            })
            return kategoriss;
        }).catch(err => {
            console.error(err);
        })
    
    console.log(kategoris);

    fetch(produkDetEndPoin, get_config)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.data);


            contents.innerHTML = `
            <form id="editProdukForm" action="javascript:editingProduk(${id})" method="post">
            <div class="mb-3">
                <label for="nama" class="form-label">Nama : </label>
                <input type="text" class="form-control" id="nama" name="nama" value="${resJson.data[0].nama_produk}"> 
            </div>

            <div class="mb-3">
                <label for="kategori" class="form-label">Kategori : </label>
                <select id="kategori" name="Kategori" form="myForm">
                    <option value="${resJson.data[0].id_kategori}" selected disabled hidden>Sebelumnya "${resJson.data[0].nama_kategori}" </option>
                    ${kategoris}
                </select>    
            </div>

            <div class="mb-3">
                <label for="brand" class="form-label">Brand : </label>
                <select id="brand" name="brand" form="myForm">
                    <option value="${resJson.data[0].id_brand}" selected disabled hidden>Sebelumnya "${resJson.data[0].nama_brand}"</option>
                    ${brands}
                </select>
            </div>

            <div class="mb-3">
                <label for="harga" class="form-label">Harga : </label>
                <input type="text" class="form-control" id="harga" name="harga" value="${resJson.data[0].harga}"> 
            </div>

            <div class="mb-3">
                <label for="stok" class="form-label">stok : </label>
                <input type="text" class="form-control" id="stok" name="stok" value="${resJson.data[0].stok}"> 
            </div>

            <div class="mb-3">
                <label for="spesifikasi" class="form-label">spesifikasi : </label>
                <input type="text" class="form-control" id="spesifikasi" name="spesifikasi" value="${resJson.data[0].spesifikasi}"> 
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>    
            </form>
            `

        }).catch(err => {
            console.error(err);
        })
}

function editingProduk(id) {
    title.innerHTML="<h2>Edit Produk</h2>";
    var nama= document.getElementById("nama").value;
    var kategori= document.getElementById("kategori").value;
    var brand= document.getElementById("brand").value;
    var harga= document.getElementById("harga").value;
    var stok= document.getElementById("stok").value;
    var spesifikasi= document.getElementById("spesifikasi").value;
    
    console.log(nama);
    //https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
    fetch(produkEndPoin, {
        method: "PUT",
        
        body: new URLSearchParams({
            'nama': nama,
            'kategori': kategori,
            'brand': brand,
            'harga': harga,
            'stok': stok,
            'spesifikasi': spesifikasi,
            'id_produk' : id
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        location.href="#produk"
        loadPage('produk')

    }).catch(err => {
        console.error(err)
    })
}

function deleteProduk(id) {
    fetch(produkEndPoin, {
        method: "DELETE",
        
        body: new URLSearchParams({
            'id_produk' : id
        }),

        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            'X-Api-Key': ApiKey
        }
    }) 
    .then(response => response.json())
    .then(resJson => {
        alert(resJson.msg)
        location.href="#produk"
        loadPage('produk')

    }).catch(err => {
        console.error(err);
    })
}

