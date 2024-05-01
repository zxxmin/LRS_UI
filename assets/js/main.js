
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

    /*document.querySelector('.tbl-list').addEventListener('click', function(event) {
        if (event.target.matches('.accordion_wrap .showDetail')) {
            const accordionWrap = findClosestParent(event.target, 'accordion_wrap');
            if (accordionWrap) {
                accordionWrap.classList.toggle('on');
            }
        }
    }); 하나만 열리게 하는 버전 */

    document.querySelector('.tbl-list').addEventListener('click', function(event) {
        if (event.target.matches('.accordion_wrap .showDetail')) {
            const accordionWraps = document.querySelectorAll('.accordion_wrap');
            const clickedAccordionWrap = findClosestParent(event.target, 'accordion_wrap');

            if (clickedAccordionWrap) {
                if (clickedAccordionWrap.classList.contains('on')) {
                    clickedAccordionWrap.classList.remove('on');
                } else {
                    accordionWraps.forEach((wrap) => {
                        wrap.classList.remove('on');
                    });
                    clickedAccordionWrap.classList.add('on');
                }
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
    constructor(paginationElementId, buttonsPerPage, listElementId, renderItem) {
        this.paginationElementId = paginationElementId;
        this.buttonsPerPage = buttonsPerPage;
        this.listElementId = listElementId;
        this.renderItem = renderItem;
        this.currentPage = 1;
    }

    async fetchData(page, url) {
        const response = await fetch(`${url}?page=${page}`);
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
        this.updateList(data.list, this.renderItem); // this.renderItem 전달
    }

    updateList(list, renderItem) {
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
            const li = renderItem(item);
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


    init(url) { // url 매개변수 추가
        const paginationElement = document.querySelector(this.paginationElementId);
        const listElement = document.querySelector(this.listElementId);
        if (paginationElement && listElement) {
            this.fetchData(this.currentPage, url);
        }
    }
}

/*
const pagination = new PaginationAndList('#pagination', 5, '#tblList');
pagination.init('/example.com/data');*/

class xApiList {
    constructor(key, renderTarget, tabNavData,) {
        this.key = key;
        this.renderTarget = renderTarget;
        this.tabNavData = tabNavData;
    }

    xApiListData() {
        let result;
        switch(this.key) {
            case "Statements" :
                result = [
                    {
                        "Actor" : "이윤미",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:06:08Z",
                        "raw data" : `{"id": "3a49561a-4615-44eb-9687-9431593b964f", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000166994@cbe.go.kr"}, "name": "이윤미", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/class/scrap/selectScrapHomework.do?classId=31122", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000787", "https://xapi.dataeum.kr/extensions/session": "16CD6E609F5921E0AC2BDE269C43CAE2.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "옥동초등학교", "https://xapi.dataeum.kr/extensions/class-id": "31122", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000166994@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "이윤미"}}, "timestamp": "2024-04-25 20:06:08", "stored": "2024-04-26 05:06:08.531000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                    {
                        "Actor" : "이윤미",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:06:05Z",
                        "raw data" : `{"id": "6cc7a74c-353c-494c-af74-48ecfe14ff29", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000166994@cbe.go.kr"}, "name": "이윤미", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/class/notice.do?classId=31122", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000787", "https://xapi.dataeum.kr/extensions/session": "16CD6E609F5921E0AC2BDE269C43CAE2.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "옥동초등학교", "https://xapi.dataeum.kr/extensions/class-id": "31122", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000166994@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "이윤미"}}, "timestamp": "2024-04-25 20:06:06", "stored": "2024-04-26 05:06:05.939000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                    {
                        "Actor" : "김용식",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:06:05Z",
                        "raw data" : `{"id": "2312b15f-42d1-4c9d-8ebd-a18f8187de0b", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000300148@cbe.go.kr"}, "name": "김용식", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/bookClub.do", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000951", "https://xapi.dataeum.kr/extensions/session": "88581C1135A03E299D4573B63F82D614.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "새터초등학교", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000300148@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "김용식"}}, "timestamp": "2024-04-25 20:06:04", "stored": "2024-04-26 05:06:05.227000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                    {
                        "Actor" : "이윤미",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:06:02Z",
                        "raw data" : `{"id": "06405229-c959-43c2-9dfd-43936531f8aa", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000166994@cbe.go.kr"}, "name": "이윤미", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/class/homework/selectHomeworkList.do?classId=31122", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000787", "https://xapi.dataeum.kr/extensions/session": "16CD6E609F5921E0AC2BDE269C43CAE2.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "옥동초등학교", "https://xapi.dataeum.kr/extensions/class-id": "31122", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000166994@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "이윤미"}}, "timestamp": "2024-04-25 20:06:02", "stored": "2024-04-26 05:06:02.698000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                    {
                        "Actor" : "이윤미",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:05:58Z",
                        "raw data" : `{"id": "7db28229-b547-4662-bbf5-436aadd9572b", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000166994@cbe.go.kr"}, "name": "이윤미", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/class/study/studyroom.do?classId=31122", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000787", "https://xapi.dataeum.kr/extensions/session": "16CD6E609F5921E0AC2BDE269C43CAE2.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "옥동초등학교", "https://xapi.dataeum.kr/extensions/class-id": "31122", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000166994@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "이윤미"}}, "timestamp": "2024-04-25 20:05:58", "stored": "2024-04-26 05:05:58.080000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                    {
                        "Actor" : "김용식",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:05:48Z",
                        "raw data" : `{"id": "a79fb7b6-e1c8-4e4b-89ab-ff87065947e2", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000300148@cbe.go.kr"}, "name": "김용식", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/bookClub/detail.do?classId=31665&userId=kbj23u08", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000951", "https://xapi.dataeum.kr/extensions/session": "88581C1135A03E299D4573B63F82D614.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "새터초등학교", "https://xapi.dataeum.kr/extensions/class-id": "31665", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000300148@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "김용식"}}, "timestamp": "2024-04-25 20:05:48", "stored": "2024-04-26 05:05:48.211000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                    {
                        "Actor" : "강선민",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:05:43Z",
                        "raw data" : `{"id": "04cae581-59a6-4c1c-acc8-f7e974800835", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000322684@cbe.go.kr"}, "name": "강선민", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/class/compose/createClass.do", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000958", "https://xapi.dataeum.kr/extensions/session": "9FA9BAFBE8A27C1BB7D8BFD04B2C2D07.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "용암초등학교", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000322684@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "강선민"}}, "timestamp": "2024-04-25 20:05:43", "stored": "2024-04-26 05:05:43.887000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                    {
                        "Actor" : "이윤미",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:05:31Z",
                        "raw data" : `{"id": "b1741ab7-80c0-459e-90a7-24b794f792cb", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000166994@cbe.go.kr"}, "name": "이윤미", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/cop/cmy/home.do", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000787", "https://xapi.dataeum.kr/extensions/session": "16CD6E609F5921E0AC2BDE269C43CAE2.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "옥동초등학교", "https://xapi.dataeum.kr/extensions/class-id": "31122", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000166994@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "이윤미"}}, "timestamp": "2024-04-25 20:05:31", "stored": "2024-04-26 05:05:31.433000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                    {
                        "Actor" : "김용식",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:05:26Z",
                        "raw data" : `{"id": "fbdb1646-09ef-4b68-9654-ec6084ce69ea", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000300148@cbe.go.kr"}, "name": "김용식", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/bookClub.do", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000951", "https://xapi.dataeum.kr/extensions/session": "88581C1135A03E299D4573B63F82D614.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "새터초등학교", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000300148@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "김용식"}}, "timestamp": "2024-04-25 20:05:25", "stored": "2024-04-26 05:05:26.023000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                    {
                        "Actor" : "이윤미",
                        "Verb" : "viewed",
                        "Object" : "다채움",
                        "Stored" : "2024-04-26T05:05:23Z",
                        "raw data" : `{"id": "6daee7e3-cf41-4b7a-992d-96995bac877d", "actor": {"account": {"homePage": "https://class.cbe.go.kr/", "name": "ESNTL_00000000166994@cbe.go.kr"}, "name": "이윤미", "objectType": "Agent"}, "verb": {"_id": "http://id.tincanapi.com/verb/viewed", "display": {"en-US": "viewed", "ko-KR": "조회하다"}}, "object": {"_id": "https://class.cbe.go.kr/class/scrap/selectBookScrapList.do?classId=31122", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}, "context": {"extensions": {"https://xapi.dataeum.kr/extensions/ed-app": {"id": "class.cbe.go.kr", "name": "충북 다채움"}, "https://xapi.dataeum.kr/extensions/roles": "Instructor", "https://xapi.dataeum.kr/extensions/school-id": "M100000787", "https://xapi.dataeum.kr/extensions/session": "16CD6E609F5921E0AC2BDE269C43CAE2.ajp13_worker", "https://xapi.dataeum.kr/extensions/organization-id": "cbe.go.kr", "https://xapi.dataeum.kr/extensions/organization-name": "충북교육청", "https://xapi.dataeum.kr/extensions/school-name": "옥동초등학교", "https://xapi.dataeum.kr/extensions/class-id": "31122", "https://xapi.dataeum.kr/extensions/user-id": "ESNTL_00000000166994@cbe.go.kr", "https://xapi.dataeum.kr/extensions/user-name": "이윤미"}}, "timestamp": "2024-04-25 20:05:22", "stored": "2024-04-26 05:05:23.071000", "authority": {"mbox": "mailto:entro80@dataeum.kr", "name": "lrs", "objectType": "Agent"}, "version": "1.0.3"}`
                    },
                ]
                break;
            case "Agents" : 
                result = [
                    {
                        "Name" : "이다진",
                        "Account Name" : "ldj23i01@cbe.go.kr",
                        "Account Homepage" : "https://class.cbe.go.kr/",
                        "Statements Count" : "22",
                        "raw data" : `{"account": {"homePage": "https://class.cbe.go.kr/", "name": "ldj23i01@cbe.go.kr"}, "name": "이다진", "objectType": "Agent"}`
                    },
                    {
                        "Name" : "박윤민",
                        "Account Name" : "pym23p02@cbe.go.kr",
                        "Account Homepage" : "https://class.cbe.go.kr/",
                        "Statements Count" : "4",
                        "raw data" : `{"account": {"homePage": "https://class.cbe.go.kr/", "name": "pym23p02@cbe.go.kr"}, "name": "박윤민", "objectType": "Agent"}`
                    },
                    {
                        "Name" : "이유주",
                        "Account Name" : "lyj23z28@cbe.go.kr",
                        "Account Homepage" : "https://class.cbe.go.kr/",
                        "Statements Count" : "38",
                        "raw data" : `{"account": {"homePage": "https://class.cbe.go.kr/", "name": "lyj23z28@cbe.go.kr"}, "name": "이유주", "objectType": "Agent"}`
                    }
                ]
                break;
            case "Activities" :
                result = [
                    {
                        "ID" : "https://class.cbe.go.kr/class/notice.do?classId=28275",
                        "Name" : "다채움",
                        "Description" : "해당 URL 페이지 조회",
                        "Statements Count" : "2",
                        "raw data" : `{"_id": "https://class.cbe.go.kr/class/notice.do?classId=28275", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}`
                    },
                    {
                        "ID" : "https://class.cbe.go.kr/cop/cmy/badgeStatus.do?esntlId=ESNTL_00000000086807&userNm=%EC%9E%A5%EC%98%88%EB%82%98&eventYear=2024",
                        "Name" : "다채움",
                        "Description" : "해당 URL 페이지 조회",
                        "Statements Count" : "12",
                        "raw data" : `{"_id": "https://class.cbe.go.kr/cop/cmy/badgeStatus.do?esntlId=ESNTL_00000000086807&userNm=%EC%9E%A5%EC%98%88%EB%82%98&eventYear=2024", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}`
                    },
                    {
                        "ID" : "https://class.cbe.go.kr/class/community/816/detail.do?classId=28584",
                        "Name" : "다채움",
                        "Description" : "해당 URL 페이지 조회",
                        "Statements Count" : "2",
                        "raw data" : `{"_id": "https://class.cbe.go.kr/class/community/816/detail.do?classId=28584", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}`
                    },
                    {
                        "ID" : "https://class.cbe.go.kr/class/community/816/detail.do?classId=28584",
                        "Name" : "다채움",
                        "Description" : "해당 URL 페이지 조회",
                        "Statements Count" : "1",
                        "raw data" : `{"_id": "https://class.cbe.go.kr/cop/cmy/badgeStatus.do?esntlId=ESNTL_00000000142674&userNm=%EB%B0%95%EC%97%B0%EC%9E%AC&eventYear=2024", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}`
                    },
                    {
                        "ID" : "https://class.cbe.go.kr/class/community/816/detail.do?classId=28584",
                        "Name" : "다채움",
                        "Description" : "해당 URL 페이지 조회",
                        "Statements Count" : "10",
                        "raw data" : `{"_id": "https://class.cbe.go.kr/class/homework/selectHomeworkDetail.do?classId=28109&homeworkNo=1203", "definition": {"description": {"ko-KR": "해당 URL 페이지 조회"}, "name": {"ko-KR": "다채움"}}, "objectType": "Activity"}`
                    },
                ]
                break;
            case "Verbs" : 
                result = [
                    {
                        "ID" : "http://id.tincanapi.com/verb/viewed",
                        "Display" : "viewed",
                        "Statements Count" : "1007026"
                    }
                ]
                break;
            default :
                result = [];
                break;
        }

        // this.key === "Statements" ? console.log('here') : this.updateList(result);
        this.updateList(result);
    }

    updateList(data) {
        const wrap = document.querySelector(this.renderTarget);
        wrap.innerHTML = '';

        if(data.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="accordion_wrap">
                    <div class="noData">데이터가 없습니다</div>
                </div>
            `
            wrap.appendChild(li);
            return;
        }
        
        // this.tabNavVal(data);
        this.renderList(wrap, data);
    }

    renderList(wrap, data) {
        // tbody
        data.forEach(data => {

            const tbodyLi = document.createElement('li');
            const tbodyDiv = document.createElement('div');
            tbodyDiv.classList.add('accordion_wrap');

            for (const key in data) {

                if(data.hasOwnProperty(key)) {
                    const value = data[key];

                    if (key === "raw data") {
                        const div = document.createElement('div');
                        div.innerHTML = `
                            <button class="btn sm showDetail">상세보기</button>
                        `
                        tbodyDiv.append(div);


                        const accorCont = document.createElement('div');
                        accorCont.classList.add('accordion_content');
                        accorCont.innerHTML = `
                            <strong class=title>문항 리스트</strong>
                            <div>
                                <pre>
                                    ${value}
                                </pre>
                            </div>
                        `
                        tbodyLi.appendChild(accorCont);
                        

                    } else {
                        const tbodyTxt = document.createElement('div');
                        tbodyTxt.textContent = value;

                        tbodyDiv.append(tbodyTxt);
                    }
                }
            }

            tbodyLi.prepend(tbodyDiv);
            wrap.append(tbodyLi);
        })

        // thead
        const theadLi = document.createElement('li');
        theadLi.classList.add('thead');

        const theadDiv = document.createElement('div');
        theadDiv.classList.add('accordion_wrap');


        //search
        const searchLi = document.createElement('li');
        const searchDiv = document.createElement('div');
        searchDiv.classList.add('accordion_wrap');


        Object.keys(data[0]).forEach(key => {
            const theadTit = document.createElement('button');
            theadTit.textContent = key;

            theadDiv.append(theadTit);


            if (key === 'Statements Count' || key === 'raw data') {
                const spanWrap = document.createElement('div');
                spanWrap.innerHTML = `
                    <span class="txtHide">공란</span>
                `;
                searchDiv.append(spanWrap);
                
            } else {
                const searchWrap = document.createElement('div');
                searchWrap.innerHTML = `
                    <div class="search">
                        <input type=text class=ico-search title=검색어 입력>
                        <button class=btn ico-close>취소</button>
                    </div>
                `;
                searchDiv.append(searchWrap);
            }
        })

        searchLi.append(searchDiv);
        wrap.prepend(searchLi);
        
        theadLi.append(theadDiv);
        wrap.prepend(theadLi);
    }
}
