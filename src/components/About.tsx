export function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="about__intro">
        <h2 id="about-title">About the model</h2>
        <p>
          The calculator uses a logistic regression model developed in a cohort of adolescents with idiopathic scoliosis
          who started bracing with a major Cobb below 45°. It combines five measurements to estimate whether the curve
          measured 45° or more at the patient’s last available follow-up.
        </p>
      </div>

      <div className="about__grid">
        <dl className="facts">
          <div><dt>Patients in the model</dt><dd>98</dd></div>
          <div><dt>Reached 45° or more</dt><dd>13</dd></div>
          <div><dt>Mean cross-validated AUC</dt><dd>0.855</dd></div>
          <div><dt>Validation</dt><dd>Internal only</dd></div>
        </dl>

        <div className="caveats">
          <h3>Keep in mind</h3>
          <ul>
            <li>
              Brace wear is the average actually observed over the whole bracing course, which isn’t known when bracing
              starts. Changing it shows an association, not the effect of wearing the brace more, and it isn’t a
              recommended number of hours.
            </li>
            <li>
              The estimate isn’t a surgery risk, a two-year risk, or a risk at skeletal maturity, and the remaining
              percentage isn’t a “bracing success” rate.
            </li>
            <li>
              The model was developed exploratorily from a small number of events and hasn’t been tested on an outside
              cohort yet. Only one patient was Sanders stage 6.
            </li>
            <li>No patient in the cohort was younger than 10.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
