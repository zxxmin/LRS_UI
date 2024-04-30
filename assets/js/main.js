
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

// 가장 가까운 부모 찾는 함수
function findClosestParent(element, className) {
    while (element) {
        if (element.classList.contains(className)) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
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

    document.querySelector('.tbl-list').addEventListener('click', function(event) {
        if (event.target.matches('.accordion_wrap .btn.sm')) {
            const accordionWrap = findClosestParent(event.target, 'accordion_wrap');
            if (accordionWrap) {
                accordionWrap.classList.toggle('on');
            }
        }
    });
})

// tblList 버튼 클릭 이벤트
document.querySelectorAll('#tblList .thead button').forEach((button) => {
    button.addEventListener('click', () => {
        if (button.classList.contains('up')) {
            button.classList.remove('up');
            button.classList.add('down');
        } else {
            button.classList.remove('down');
            button.classList.add('up');
        }

        const isAscending = button.classList.contains('up');
        const parentElement = button.parentElement;
        const index = Array.prototype.indexOf.call(parentElement.children, button);
        sortList(index, isAscending);
    });
});

// 리스트 정렬 함수
function sortList(columnIndex, isAscending) {
    const listElement = document.querySelector('#tblList');
    const dataRows = Array.from(listElement.querySelectorAll('li:not(.thead)'));

    dataRows.sort((a, b) => {
        const aText = a.querySelector(`*:nth-child(${columnIndex + 1})`).textContent.trim();
        const bText = b.querySelector(`*:nth-child(${columnIndex + 1})`).textContent.trim();

        const compareResult = aText.localeCompare(bText);

        return isAscending ? compareResult : -compareResult;
    });

    dataRows.forEach(row => listElement.appendChild(row));
}

class PaginationAndList {
    constructor(paginationElementId, buttonsPerPage, listElementId) {
        this.paginationElementId = paginationElementId;
        this.buttonsPerPage = buttonsPerPage;
        this.listElementId = listElementId;
        this.currentPage = 1;
    }

    async fetchData(page) {
        const response = await fetch(`/example.com/data?page=${page}`);
        console.log(response, '서버 예시 테스트')

        const data = {
            totalPages: 132,
            list: [
                {
                    no: '000001',
                    schoolLevel: '초등학교',
                    grade: '3~4학년',
                    subject: '수학',
                    area: '물의 여행',
                    standardCode: '[4과17-02]',
                    standardDetail: '물의 중요성을 알고 물 부족 현상을 해결하기 위해 창의적 방법을 활용한 사례를 조사할 수 있다.',
                    title: 'ㄷ빗방울의 지구 여행',
                    viewCount: '1,847'
                },
            ]
        };

        this.generatePagination(data.totalPages, page); // 페이지네이션 그리기
        this.updateList(data.list); // 리스트 그리기
    }

    updateList(list) {
        const listElement = document.querySelector(this.listElementId);
        let child = listElement.lastElementChild;
        while (child && child !== listElement.firstElementChild) {
            listElement.removeChild(child);
            child = listElement.lastElementChild;
        }

        // 데이터가 없는 경우
        if (list.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = `
            <div class="accordion_wrap">
                <div class="noData">데이터가 없습니다</div>
            </div>
        `;
            listElement.appendChild(li);
            return;
        }

        // 데이터가 있는 경우
        list.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
            <div class="accordion_wrap on">
                <div>${item.no}</div>
                <div>${item.schoolLevel}</div>
                <div>${item.grade}</div>
                <div>${item.subject}</div>
                <div>${item.subject}</div>
                <div>${item.area}</div>
                <div>${item.standardCode}</div>
                <div class="width_auto">${item.standardDetail}</div>
                <div>${item.title}</div>
                <div>
                    <div class="bar">
                        <div class="current" style="width: 70%"></div>
                        <span class="count">${item.viewCount}</span>
                    </div>
                </div>
            </div>
        `;
            listElement.appendChild(li);
        });
    }

    generatePaginationButton(parent, className, title, text) {
        const button = document.createElement('button');
        button.className = className;
        button.title = title;
        button.textContent = text || '';
        parent.appendChild(button);
        return button;
    }

    handlePaginationButtonClick(button, page) {
        button.addEventListener('click', () => {
            this.fetchData(page);
        });
    }

    generatePagination(totalPages, currentPage) {
        const paginationElement = document.querySelector(this.paginationElementId);
        paginationElement.innerHTML = '';

        const firstButton = this.generatePaginationButton(paginationElement, 'first', '첫 페이지로');
        const prevButton = this.generatePaginationButton(paginationElement, 'prev', '이전');

        const ul = document.createElement('ul');
        ul.className = 'pagination';
        paginationElement.appendChild(ul);

        let startPage = Math.floor((currentPage - 1) / this.buttonsPerPage) * this.buttonsPerPage + 1;
        let endPage = Math.min(startPage + this.buttonsPerPage - 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement('li');
            const button = this.generatePaginationButton(li, '', i, i.toString());
            if (i === currentPage) {
                button.classList.add('on');
            }
            this.handlePaginationButtonClick(button, i);
            ul.appendChild(li);
        }

        const nextButton = this.generatePaginationButton(paginationElement, 'next', '다음');
        const lastButton = this.generatePaginationButton(paginationElement, 'last', '마지막 페이지로');

        this.handlePaginationButtonClick(firstButton, 1);
        this.handlePaginationButtonClick(prevButton, Math.max(1, currentPage - 1));
        this.handlePaginationButtonClick(nextButton, Math.min(totalPages, currentPage + 1));
        this.handlePaginationButtonClick(lastButton, totalPages);
    }


    init() {
        const paginationElement = document.querySelector(this.paginationElementId);
        const listElement = document.querySelector(this.listElementId);
        if (paginationElement && listElement) {
            this.fetchData(this.currentPage);
        }
    }
}

const pagination = new PaginationAndList('#pagination', 5, '#tblList');
pagination.init();