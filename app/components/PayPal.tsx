import { useEffect } from 'react';
import { usePayPalScriptReducer, PayPalButtons } from '@paypal/react-paypal-js';

const currency = 'USD';
const style = { layout: 'vertical' };

// Custom component to wrap the PayPalButtons and handle currency changes
const PayPal = ({ amount, paymentSession }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: 'resetOptions',
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency]);

    return (
        <>
            {isPending && <span>Loading.......</span>}
            <PayPalButtons
                disabled={false}
                forceReRender={[amount, currency, style]}
                fundingSource={undefined}
                createOrder={() => paymentSession}
                onApprove={async (data, actions) => {
                    return await actions.order?.authorize()
                        .then(() => {
                            console.log('COMPLETE');
                            // onPaymentCompleted()
                        })
                        .finally(() => {
                            // setProcessing(false)
                            document.getElementById('payment').submit();
                        })
                }}
            />
        </>
    );
};

export default PayPal;
