import anime from "animejs";
import flatpickr from "flatpickr";
import { Russian as flatpickrRu } from "flatpickr/dist/l10n/ru.js";

function switchMenuOnOuterClick(e: Event) {
    const element = e.target;
    if (element instanceof HTMLElement && (element as HTMLElement).classList.contains("nav-menu__links-wrapper")) {
        switchMenu();
    }
}

var menuState = 0;

function switchMenu() {
    const linksWrapper = document.querySelector(".nav-menu__links-wrapper") as HTMLElement;
    if (linksWrapper.hasAttribute("open")) {
        linksWrapper.removeAttribute("open");

        linksWrapper.removeEventListener("click", switchMenuOnOuterClick, true);

        document.body.style.removeProperty("overflow-y");

        menuState = 0;

        anime({
            targets: linksWrapper,
            easing: "easeOutQuart",
            duration: 300,
            opacity: 0,
            complete: anim => {
                if (menuState !== 0)
                    return;

                linksWrapper.style.removeProperty("opacity");
                linksWrapper.style.removeProperty("visibility");
            }
        });
    } else {
        linksWrapper.setAttribute("open", "");

        linksWrapper.style.visibility = "visible";
        document.body.style.overflowY = "hidden";

        linksWrapper.addEventListener("click", switchMenuOnOuterClick, true);

        menuState = 1;

        anime({
            targets: linksWrapper,
            easing: "easeOutQuart",
            duration: 300,
            opacity: 1,
            complete: anim => {
                if (menuState !== 1)
                    return;

                linksWrapper.style.visibility = "visible";
            }
        });

        anime({
            targets: ".nav-menu__links-wrapper a",
            easing: "easeOutQuart",
            duration: 300,
            translateX: ["-1rem", "0"],
            opacity: [0, 1],
            delay: anime.stagger(50)
        });
    }
}

document.querySelector(".nav-menu__menu-button")!.addEventListener("click", switchMenu);

flatpickr("#datetime",
    {
        locale: flatpickrRu,
        allowInput: true,
        disableMobile: true,
        minDate: "today",
        enableTime: true,
        minTime: "10:00",
        maxTime: "20:00",
        minuteIncrement: 15,
        altInput: true,
        altFormat: "d.m.Y H:i"
    });
    
document.getElementById("bookForm")!.addEventListener("submit", event => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    form.setAttribute("disabled", "");
    
    fetch(form.action, {
        method: "post",
        body: new FormData(form)
    });

    window.location.href = "/visit/booking-thanks";
});