const clickLayout = (target, classNm) => {
    target?.forEach(list => {
        list.addEventListener('click', (e) => {
            target.forEach(list => list.classList.remove(classNm))
            e.currentTarget.classList.add(classNm);
        })
    })
}

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

clickLayout(menuLink, 'isCurrent');