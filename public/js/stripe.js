// const stripe = Stripe(
//   'pk_test_51NA7kgIOpPn6m49d5lEl2dwYkoRqWHDqdJhg4nCPvmRGIgSf6SWRnZjNqV5Lt1GDEGb2tqITPwpskJJ0dF0j0sfk00b8XVjycm'
// );
const bookTour = async (tourId) => {
  try {
    // const session = await axios({
    //   method: 'GET',
    //   url: `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    // });

    const session = await fetch(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    await stripe.redirectToCheckout({
      // sessionId: session.data.session.id,
      sessionId: tourId,
    });
  } catch (err) {
    showAlertStripe('error', err);
  }
};

document.querySelector('#book-tour').addEventListener('click', (e) => {
  e.target.textContent = 'Processing...';
  const { tourId } = e.target.dataset;
  bookTour(tourId);
});

const hideAlertStripe = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertStripe = (type, msg) => {
  hideAlertStripe();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
};
