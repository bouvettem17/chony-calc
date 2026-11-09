import { useEffect, useRef, useState } from 'react';

/*
  Disclosure gate. Shown on every page load (nothing is stored, so the "nothing saved" promise stays true).
  The wording is a draft: have your institution's legal/compliance office review it before launch.
*/
interface Props {
  open: boolean;
  onAgree: () => void;
}

export function Disclosure({ open, onAgree }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="disclosure"
      aria-labelledby="disclosure-title"
      onCancel={(e) => e.preventDefault() /* Esc can't skip the agreement */}
    >
      {declined ? (
        <div className="disclosure__body">
          <h2 id="disclosure-title">The calculator is unavailable</h2>
          <p>You need to accept the disclosure before you can use CHONY Calc.</p>
          <div className="disclosure__actions">
            <button type="button" className="btn btn--primary" onClick={() => setDeclined(false)} autoFocus>
              Read the disclosure again
            </button>
          </div>
        </div>
      ) : (
        <div className="disclosure__body">
          <h2 id="disclosure-title">Before you use this calculator</h2>
          <div className="disclosure__text">
            <p>
              CHONY Calc is a research prototype. Its estimates come from a statistical model developed in one cohort of
              braced patients. The model has been validated internally only and has not been externally validated.
            </p>
            <p>
              It is not a substitute for medical advice, diagnosis, or treatment, and it should not be used on its own to
              make decisions about bracing, surgery, or any other care. Direct medical questions to a physician or other
              qualified health care provider. Using this tool does not create a physician–patient relationship.
            </p>
            <p>
              Nothing you enter is saved or sent anywhere; every calculation happens in your browser. The developers
              cannot see what you enter and cannot contact you.
            </p>
            <p>
              The information is provided as is, without warranties of any kind, express or implied, including about its
              accuracy, completeness, or fitness for a particular purpose. The developers and their institutions accept
              no liability for any decision made, or action taken or not taken, based on it.
            </p>
          </div>
          <p className="disclosure__consent">
            I understand that this estimate does not replace advice from my own physician, and I agree to the terms above.
          </p>
          <div className="disclosure__actions">
            <button type="button" className="btn btn--primary" onClick={onAgree} autoFocus>I agree</button>
            <button type="button" className="btn" onClick={() => setDeclined(true)}>I don’t agree</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
