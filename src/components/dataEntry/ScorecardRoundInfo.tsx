import React from 'react';
// import { Button } from 'react-bootstrap';
// import RoundEditModal from './RoundEditModal';

const ScorecardRoundInfo = () => (
// const [editing, setEditing] = useState<boolean>(false);
  <>
    <div className="d-flex mx-n3 mx-md-n5 p-3 bg-light border-bottom">
      <div>
        Round Name (if there)
      </div>
      <div>
        Date
      </div>
      <div>
        Course
      </div>
      <div className="ml-auto">
        {/* <Button variant="link" className="text-reset" onClick={() => setEditing(true)}>
          <i className="fe fe-edit" />
        </Button> */}
      </div>
    </div>
    {/* <RoundEditModal roundId={28} show={editing} onHide={() => setEditing(false)} /> */}
  </>
);
export default ScorecardRoundInfo;
