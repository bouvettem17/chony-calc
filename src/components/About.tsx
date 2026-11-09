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

      <dl className="facts">
        <div><dt>Patients in the model</dt><dd>98</dd></div>
        <div><dt>Reached 45° or more</dt><dd>13</dd></div>
        <div><dt>Mean cross-validated AUC</dt><dd>0.855</dd></div>
      </dl>
    </section>
  );
}
