// ==========================================
// AMIR NEWS + SUPABASE
// ==========================================

const SUPABASE_URL = "https://vyegcyyncmqzhcvsyhbi.supabase.co";

// Publishable Key
const SUPABASE_KEY = "sb_publishable_zUugzOxldDhjgZwenwZ3BQ_tSLjYTjb";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// عمومی - صفحه اصلی
// ==========================================

let allNews = [];
let currentCategory = "همه";


// ==========================================
// دریافت خبرها
// ==========================================

async function loadNews() {

    const { data, error } = await supabaseClient
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error("SUPABASE ERROR:", error);

        const grid = document.getElementById("newsGrid");

        if (grid) {

            grid.innerHTML = `
                <div class="empty-state">
                    <div>⚠️</div>
                    <h3>خطا در دریافت خبرها</h3>
                    <p>اتصال سایت به پایگاه داده را بررسی کن.</p>
                </div>
            `;
        }

        return;
    }

    allNews = data || [];

    renderHome();
}


// ==========================================
// نمایش صفحه اصلی
// ==========================================

function renderHome() {

    if (!document.getElementById("newsGrid")) {
        return;
    }

    let filtered = [...allNews];


    // دسته‌بندی

    if (currentCategory !== "همه") {

        filtered = filtered.filter(
            news => news.category === currentCategory
        );
    }


    // جستجو

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput && searchInput.value.trim()) {

        const query =
            searchInput.value.trim().toLowerCase();

        filtered = filtered.filter(news =>

            (news.title || "")
                .toLowerCase()
                .includes(query)

            ||

            (news.content || "")
                .toLowerCase()
                .includes(query)
        );
    }


    renderHero(filtered);
    renderSide(filtered);
    renderGrid(filtered);


    // خبر فوری

    const breaking =
        document.getElementById("breakingText");

    if (breaking && allNews.length) {

        breaking.textContent =
            allNews[0].title;
    }
}


// ==========================================
// خبر اصلی
// ==========================================

function renderHero(news) {

    const hero =
        document.getElementById("heroNews");

    if (!hero) {
        return;
    }


    if (!news.length) {

        hero.innerHTML = `
            <div class="loading">
                خبری موجود نیست.
            </div>
        `;

        return;
    }


    const item = news[0];


    hero.innerHTML = `

        <a
            href="news.html?id=${item.id}"
            class="hero-link"
        >

            <img
                class="hero-image"
                src="${safeImage(item.image)}"
                alt="${escapeHtml(item.title)}"
                onerror="
                    this.src='https://placehold.co/1000x600?text=AmirNews'
                "
            >

            <div class="hero-overlay">

                <span class="category">
                    ${escapeHtml(item.category)}
                </span>

                <h1>
                    ${escapeHtml(item.title)}
                </h1>

                <div class="meta">
                    ${formatDate(item.created_at)}
                </div>

            </div>

        </a>
    `;
}


// ==========================================
// خبرهای کناری
// ==========================================

function renderSide(news) {

    const container =
        document.getElementById("sideNews");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    news.slice(1, 4).forEach(item => {

        const card =
            document.createElement("a");


        card.className =
            "side-card";


        card.href =
            `news.html?id=${item.id}`;


        card.innerHTML = `

            <img
                src="${safeImage(item.image)}"
                alt="${escapeHtml(item.title)}"
                onerror="
                    this.src='https://placehold.co/300x200?text=News'
                "
            >

            <div>

                <span class="category">
                    ${escapeHtml(item.category)}
                </span>

                <h3>
                    ${escapeHtml(item.title)}
                </h3>

                <div class="meta">
                    ${formatDate(item.created_at)}
                </div>

            </div>

        `;


        container.appendChild(card);
    });
}


// ==========================================
// کارت‌های خبر
// ==========================================

function renderGrid(news) {

    const grid =
        document.getElementById("newsGrid");

    const empty =
        document.getElementById("emptyState");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (!news.length) {

        empty?.classList.remove("hidden");

        return;
    }


    empty?.classList.add("hidden");


    news.forEach(item => {


        // کارت به صورت لینک ساخته می‌شود

        const card =
            document.createElement("a");


        card.className =
            "news-card";


        card.href =
            `news.html?id=${item.id}`;


        card.innerHTML = `

            <img
                src="${safeImage(item.image)}"
                alt="${escapeHtml(item.title)}"
                onerror="
                    this.src='https://placehold.co/600x400?text=AmirNews'
                "
            >

            <div class="news-card-body">

                <span class="category">
                    ${escapeHtml(item.category)}
                </span>

                <h3>
                    ${escapeHtml(item.title)}
                </h3>

                <p>
                    ${escapeHtml(item.content)}
                </p>

                <div class="meta">
                    ${formatDate(item.created_at)}
                </div>

            </div>

        `;


        grid.appendChild(card);

    });
}


// ==========================================
// دسته‌بندی‌ها
// ==========================================

document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener("click", () => {


            document
                .querySelectorAll(".nav-btn")
                .forEach(btn => {

                    btn.classList.remove("active");

                });


            button.classList.add("active");


            currentCategory =
                button.dataset.category;


            renderHome();

        });

    });


// ==========================================
// جستجو
// ==========================================

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            renderHome();

        }
    );
}


// ==========================================
// Dark Mode
// ==========================================

const themeBtn =
    document.getElementById("themeBtn");


if (themeBtn) {


    const savedTheme =
        localStorage.getItem("amirnews-theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";
    }


    themeBtn.addEventListener("click", () => {


        document.body.classList.toggle("dark");


        const dark =
            document.body.classList.contains("dark");


        localStorage.setItem(
            "amirnews-theme",
            dark ? "dark" : "light"
        );


        themeBtn.textContent =
            dark ? "☀️" : "🌙";

    });

}


// ==========================================
// ADMIN LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {


    checkAdminSession();


    loginForm.addEventListener(
        "submit",
        async event => {


            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            message.textContent =
                "در حال ورود...";


            const { error } =
                await supabaseClient.auth
                    .signInWithPassword({
                        email,
                        password
                    });


            if (error) {

                console.error(error);


                message.textContent =
                    "❌ ایمیل یا رمز عبور اشتباه است.";


                return;
            }


            await checkAdminSession();

        }
    );
}


// ==========================================
// بررسی ادمین
// ==========================================

async function checkAdminSession() {


    const {
        data: { user }
    } =
        await supabaseClient.auth.getUser();


    if (!user) {
        return;
    }


    const ADMIN_UID =
        "8c5d4c7d-0cb0-4ba1-ae06-2e30535a7df7";


    if (user.id !== ADMIN_UID) {


        await supabaseClient.auth.signOut();


        const message =
            document.getElementById(
                "loginMessage"
            );


        if (message) {

            message.textContent =
                "❌ این حساب اجازه ورود به پنل مدیریت را ندارد.";

        }


        return;
    }


    document
        .getElementById("loginBox")
        ?.classList.add("hidden");


    document
        .getElementById("dashboard")
        ?.classList.remove("hidden");


    loadAdminNews();
}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {


    logoutBtn.addEventListener(
        "click",
        async () => {


            await supabaseClient.auth.signOut();


            location.reload();

        }
    );
}


// ==========================================
// ADMIN NEWS FORM
// ==========================================

const newsForm =
    document.getElementById("newsForm");


if (newsForm) {


    newsForm.addEventListener(
        "submit",
        async event => {


            event.preventDefault();


            const id =
                document
                    .getElementById("newsId")
                    .value;


            const title =
                document
                    .getElementById("newsTitle")
                    .value
                    .trim();


            const category =
                document
                    .getElementById("newsCategory")
                    .value;


            const content =
                document
                    .getElementById("newsContent")
                    .value
                    .trim();


            const image =
                document
                    .getElementById("newsImage")
                    .value
                    .trim();


            const message =
                document.getElementById(
                    "newsMessage"
                );


            message.textContent =
                "در حال ذخیره...";


            let result;


            // ویرایش

            if (id) {


                result =
                    await supabaseClient
                        .from("news")
                        .update({

                            title,
                            category,
                            content,
                            image: image || null

                        })
                        .eq("id", id);


            }

            // ایجاد خبر جدید

            else {


                result =
                    await supabaseClient
                        .from("news")
                        .insert({

                            title,
                            category,
                            content,
                            image: image || null

                        });

            }


            if (result.error) {


                console.error(
                    "SUPABASE ERROR:",
                    result.error
                );


                message.textContent =
                    "❌ " +
                    result.error.message;


                return;
            }


            message.textContent =
                id
                    ? "✅ خبر ویرایش شد."
                    : "✅ خبر منتشر شد.";


            resetNewsForm();


            loadAdminNews();

        }
    );
}


// ==========================================
// دریافت خبرهای پنل ادمین
// ==========================================

async function loadAdminNews() {


    const list =
        document.getElementById(
            "adminNewsList"
        );


    if (!list) {
        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("news")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {


        console.error(error);


        list.innerHTML =
            "❌ خطا در دریافت خبرها.";


        return;
    }


    if (!data.length) {


        list.innerHTML =
            `
            <p class="meta">
                هنوز خبری منتشر نکرده‌ای.
            </p>
            `;


        return;
    }


    list.innerHTML = "";


    data.forEach(item => {


        const row =
            document.createElement("div");


        row.className =
            "admin-news-item";


        row.innerHTML = `

            <div>

                <h3>
                    ${escapeHtml(item.title)}
                </h3>

                <span class="meta">

                    ${escapeHtml(item.category)}

                    •

                    ${formatDate(item.created_at)}

                </span>

            </div>


            <div class="admin-news-actions">


                <button
                    class="edit-btn"
                    onclick="editNews(${item.id})"
                >
                    ✏️ ویرایش
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteNews(${item.id})"
                >
                    🗑️ حذف
                </button>


            </div>

        `;


        list.appendChild(row);

    });
}


// ==========================================
// ویرایش خبر
// ==========================================

window.editNews =
    async function(id) {


        const {
            data,
            error
        } =
            await supabaseClient
                .from("news")
                .select("*")
                .eq("id", id)
                .single();


        if (error || !data) {


            alert("خبر پیدا نشد.");


            return;
        }


        document
            .getElementById("newsId")
            .value = data.id;


        document
            .getElementById("newsTitle")
            .value = data.title;


        document
            .getElementById("newsCategory")
            .value = data.category;


        document
            .getElementById("newsContent")
            .value = data.content;


        document
            .getElementById("newsImage")
            .value = data.image || "";


        document
            .getElementById("formTitle")
            .textContent =
            "ویرایش خبر";


        document
            .getElementById("cancelEdit")
            ?.classList
            .remove("hidden");


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


// ==========================================
// حذف خبر
// ==========================================

window.deleteNews =
    async function(id) {


        const confirmed =
            confirm(
                "مطمئنی می‌خواهی این خبر را حذف کنی؟"
            );


        if (!confirmed) {
            return;
        }


        const { error } =
            await supabaseClient
                .from("news")
                .delete()
                .eq("id", id);


        if (error) {


            alert(
                "❌ حذف خبر انجام نشد."
            );


            console.error(error);


            return;
        }


        loadAdminNews();

    };


// ==========================================
// ریست فرم
// ==========================================

function resetNewsForm() {


    document
        .getElementById("newsForm")
        ?.reset();


    const id =
        document.getElementById("newsId");


    if (id) {
        id.value = "";
    }


    const formTitle =
        document.getElementById("formTitle");


    if (formTitle) {

        formTitle.textContent =
            "افزودن خبر جدید";
    }


    document
        .getElementById("cancelEdit")
        ?.classList
        .add("hidden");
}


document
    .getElementById("cancelEdit")
    ?.addEventListener(
        "click",
        resetNewsForm
    );


// ==========================================
// HELPERS
// ==========================================

function formatDate(date) {


    if (!date) {
        return "";
    }


    return new Date(date).toLocaleDateString(
        "fa-IR",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


function safeImage(url) {


    if (!url) {

        return "https://placehold.co/1000x600?text=AmirNews";
    }


    return url;
}


function escapeHtml(text) {


    if (
        text === null ||
        text === undefined
    ) {

        return "";
    }


    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==========================================
// START
// ==========================================

loadNews();
