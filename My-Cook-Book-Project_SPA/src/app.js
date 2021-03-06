import { setupCatalog, showCatalog } from './catalog.js';
import { setupLogin, showLogin } from './login.js';
import { setupRegister, showRegister } from './register.js';
import { setupCreate, showCreate } from './create.js';

main();

function main() {
    setUserNav();
    const nav = document.querySelector('nav');
    const main = document.querySelector('main');
    const catalogSection = document.getElementById('catalogSection');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const createSection = document.getElementById('createSection');

    const links = {
        'catalogLink': showCatalog,
        'loginLink': showLogin,
        'registerLink': showRegister,
        'createLink': showCreate,
    }

    setupCatalog(main, catalogSection);
    setupLogin(main, loginSection, () => {
        setUserNav();
        showCatalog();
        setActiveNav('catalogLink');
    });
    setupRegister(main, registerSection, () => {
        setUserNav();
        showCatalog();
        setActiveNav('catalogLink');
    });
    setupCreate(main, createSection, () => { showCatalog();
        setActiveNav('catalogLink'); });

    setupNavigation();
    //start AppView
    showCatalog();


    function setActiveNav(targetId) {
        [...nav.querySelectorAll('a')].forEach(l => {
            if (l.id === targetId) {
                l.classList.add('active');
            } else {
                l.classList.remove('active')
            }
        });
    }

    function setupNavigation() {

        nav.addEventListener('click', (ev) => {
            // ev.preventDefault();
            if (ev.target.tagName === "A") {
                const view = links[ev.target.id];
                if (typeof view == 'function') {
                    ev.preventDefault();
                    setActiveNav(ev.target.id);
                    view();
                }
                console.log(ev.target.id);
            }
        });
    }

    function setUserNav() {
        if (sessionStorage.getItem('authToken') != null) {
            document.getElementById('user').style.display = 'inline-block';
            document.getElementById('guest').style.display = 'none';
            document.getElementById('logoutBtn').addEventListener('click', logout);
        } else {
            document.getElementById('guest').style.display = 'inline-block';
            document.getElementById('user').style.display = 'none';
        }
    }

    async function logout() {
        const response = await fetch('http://localhost:3030/users/logout', {
            method: 'get',
            headers: {
                'X-Authorization': sessionStorage.getItem('authToken')
            },
        });
        if (response.status == 200) {
            sessionStorage.removeItem('authToken');
            setUserNav();
            showCatalog();
        } else {
            console.error(await response.json());
        }
    }

}