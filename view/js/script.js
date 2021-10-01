let selectedId = null;
let currentPage = 1;
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

const getData = ( id, page = 1 ) => {
  return new Promise( ( resolve, reject ) => {
    const url =  `https://jsonmock.hackerrank.com/api/transactions?userId=${ id }&page=${ page }`;
    axios.get( url )
      .then( ( { data : { data : records, total_pages } } ) => {
        maxPage = total_pages;
        return resolve( records )
      } )
      .catch( err => reject( err ) );
  } )
}

const displaySpinner = ( show ) => {
  document.getElementById('loader-view').style.display = show ? 'block' : 'none';
  document.getElementById('monthly-statements').style.display = show ? 'none' : 'flex';
}

const renderStatement = ( data, append = false ) => {
  const statement = document.getElementById('monthly-statements');
  const _html = data.map( ( item ) => createDiv( item ) ).join('');
  if ( append ) {
    statement.insertAdjacentHTML( 'beforeend',  _html );
  } else {
    statement.innerHTML = _html;
  }
}

function onDropdownChange( value ) {
  if ( value ) {
    selectedId = value;
    document.getElementById('submit-btn').disabled = false;
  }
}

function onSubmitClick() {
  currentPage = 1;
  getDataAndRender()
}

function getDataAndRender( isAppend ) {
  displaySpinner( true );
  getData( selectedId, currentPage )
    .then( ( data ) => {
      renderStatement( data, isAppend )
      displaySpinner( false );
    } )
    .catch( err => console.log( err ) );
}

const scrollHandler = () => {
  const clientHeight = Math.max( document.documentElement.scrollTop, document.body.scrollTop ) + document.documentElement.clientHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  if ( clientHeight >= scrollHeight ) {
    if ( currentPage < maxPage && selectedId ) {
      currentPage = currentPage + 1;
      getDataAndRender( true )
    }
  }
}

if ( window.addEventListener ) {
  window.addEventListener( 'scroll', scrollHandler )
} else if ( window.attachEvent ) {
  window.attachEvent( 'onscroll',scrollHandler );
}
