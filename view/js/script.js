const monthlyStatements = ( document ) => document.getElementById('monthly-statements');
let selectedId = '';
let page = 1;
let maxPage  = 1;

const createDiv = ( { id, userName, amount, txnType, location : { address }, timestamp } ) => {
  let div = document.createElement('div');
  return div.innerHTML = `
    <div class="details">
      <div class="text">
        <label for="">Id:</label>
        <p class="info">${ id }</p>
      </div>
      <div class="text">
        <label for="">User:</label>
        <p class="info">${ userName }</p>
      </div>
      <div class="text">
        <label for="">Amount:</label>
        <p class="info">${ amount }</p>
      </div>
      <div class="text">
        <label for="">Transaction Type:</label>
        <p class="info">${ txnType }</p>
      </div>
      <div class="text">
        <label for="">Address:</label>
        <p class="info">${ address }</p>
      </div>
      <div class="text">
        <label for="">Transaction Time:</label>
        <p class="info">${ ( new Date( timestamp ) ).toString().slice(0, 24) }</p>
      </div>
    </div>`
}

function callApiAndRenderHtml( id, page = 1, successCallback ) {
  const loader = document.getElementById('loader-view');
  loader.style.display = 'block';
  monthlyStatements( document ).style.display = 'none';
  axios
    .get( `https://jsonmock.hackerrank.com/api/transactions?userId=${ id }&page=${ page }` )
    .then( ( { data : { data : records, total_pages } } ) => {
      maxPage = total_pages;
      const htmlContent = records.map( ( item ) => createDiv( item ) ).join('');
      successCallback( htmlContent );
      loader.style.display = 'none';
      monthlyStatements( document ).style.display = 'flex';
    } )
    .catch( ( err ) => console.log( err ) );
}

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById('submit-btn');
  const dropdown = document.getElementById('user-select');
  submitButton.addEventListener( 'click', () => {
    page = 1;
    monthlyStatements( document ).innerHTML = '';
    callApiAndRenderHtml( selectedId, page, ( htmlContent ) => monthlyStatements( document ).innerHTML = htmlContent );
  } );
  dropdown.addEventListener( 'change', (e) => {
    if ( e.target.value ) {
      selectedId = e.target.value;
      submitButton.disabled = false;
    }
  } );
} );

if ( window.addEventListener ) {
  window.addEventListener( 'scroll', scrollHandler )
} else if ( window.attachEvent ) {
  window.attachEvent( 'onscroll',scrollHandler );
}

function scrollHandler() {
  const clientHeight = Math.max( document.documentElement.scrollTop, document.body.scrollTop ) + document.documentElement.clientHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  if ( clientHeight >= scrollHeight ) {
    if ( page < maxPage && selectedId ) {
      page = page + 1;
      callApiAndRenderHtml( selectedId, page, ( htmlContent ) => monthlyStatements( document ).insertAdjacentHTML( 'beforeend',  htmlContent ) );
    }
  }
}
