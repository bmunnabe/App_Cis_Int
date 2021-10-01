const loader = ( document ) => document.getElementById('loader-view');
const statement = ( document ) => document.getElementById('monthly-statements');
const submitButton = ( document ) => document.getElementById('submit-btn');
const dropdown = ( document ) => document.getElementById('user-select');
const getUrl = ( id, page = 1 ) => `https://jsonmock.hackerrank.com/api/transactions?userId=${ id }&page=${ page }`;
let selectedValue = '';
let page = 1;
let total_pages  = 1;

const createDiv = ( data ) => {
  let iDiv = document.createElement('div');
  const date =  new Date( data.timestamp );
  return iDiv.innerHTML = `
    <div class="details">
      <p>Id: <span class="info">${ data.id }</span></p>
      <p>User: <span class="info">${ data.userName }</span></p>
      <p>Amount: <span class="info">${ data.amount }</span></p>
      <p>Transaction Type: <span class="info">${ data.txnType }</span></p>
      <p>Address: <span class="info">${ data.location.address }</span></p>
      <p>Transaction Time: <span class="info">${ date.toString().slice(0, 24) }</span></p>
    </div>
  `
}

function getHtmlContentFromApi( id, page = 1, successCallback ) {
  loader( document ).style.display = 'block';
  statement( document ).style.display = 'none';
  axios
  .get( getUrl( id, page ) )
  .then( ( { data } ) => {
    total_pages = data?.total_pages;
    const htmlContent = data?.data.map( ( item ) => createDiv( item ) ).join('');
    successCallback( htmlContent );
    loader( document ).style.display = 'none';
    statement( document ).style.display = 'flex';
  } )
  .catch( ( err ) => console.log( err ) );
}

function renderOnSubmitClick( id ) {
  statement( document ).innerHTML = '';
  getHtmlContentFromApi( id, 1, ( htmlContent ) => {
    statement( document ).innerHTML = htmlContent;
  } )
}


function appendOnScroll( id, page ) {
  getHtmlContentFromApi( id, page, ( htmlContent ) => {
    statement( document ).insertAdjacentHTML( 'beforeend',  htmlContent );
  } )
}

function onDropdownChange(e) {
  if ( e.target.value ) {
    selectedValue = e.target.value;
    submitButton( document ).disabled = false;
  }
}

function onSubmitClick() {
  page = 1;
  renderOnSubmitClick( selectedValue );
}

document.addEventListener("DOMContentLoaded", function(event) { 
  submitButton( document ).addEventListener( 'click', onSubmitClick );
  dropdown( document ).addEventListener( 'change', onDropdownChange );
});

if ( window.addEventListener ) {
  window.addEventListener( 'scroll', scroll )
} else if( window.attachEvent ) {
  window.attachEvent( 'onscroll',scroll );
}

function scroll(e){
  const value = Math.max( document.documentElement.scrollTop,document.body.scrollTop );
  if ( ( value + document.documentElement.clientHeight ) >= document.documentElement.scrollHeight ) {
    if ( page < total_pages && selectedValue ) {
      page = page + 1;
      appendOnScroll( selectedValue, page )
    }
  }
}
