import React from 'react';
import confirmUpdate from '../../helpersTools/confirmUpdate';
import notifyUpdate from '../../helpersTools/variables/notifyUpdate';

const RTFrequencySwitcher = () => {
    lsSet("RTFrequency", $("#RTFrequencySelect").val());
    confirmUpdate(notifyUpdate);
}

export default RTFrequencySwitcher;