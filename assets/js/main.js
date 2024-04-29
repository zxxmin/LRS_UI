
/**
 * clickListAddClass : list 클릭 시 class 추가 (ex. 메뉴)
 * @param {*} target list
 * @param {*} classNm class 이름
 */
const clickListAddClass = (target, classNm) => {
    target?.forEach(list => {
        list.addEventListener('click', (e) => {
            target.forEach(list => list.classList.remove(classNm))
            e.currentTarget.classList.add(classNm);
        })
    })
}

window.addEventListener("DOMContentLoaded", async () => {
    const menuList = document.querySelectorAll('.menuList > li:has(ul) > a');
    const menuLink = document.querySelectorAll('.menuList li:not(:has(> ul))');

    menuList?.forEach(a => {
        a.addEventListener('click', (e) => {
            const aChildrenUl = a.nextElementSibling.children;
            let hasIsCurrent = false;

            for (let i = 0; i < aChildrenUl.length; i++) {
                if (aChildrenUl[i].classList.contains('isCurrent')) {
                    hasIsCurrent = true;
                    break;
                }
            }

            if(!hasIsCurrent) e.currentTarget.parentElement.classList.toggle('isOpen')
        })
    })

    clickListAddClass(menuLink, 'isCurrent');

    const tabsNav = document.querySelectorAll('.tabsNav > li');
    if (tabsNav) clickListAddClass(tabsNav, 'isCurrent');

    const tabsNavSm = document.querySelectorAll('.tabsNavSm > li');
    if (tabsNavSm) clickListAddClass(tabsNavSm, 'isCurrent');
})