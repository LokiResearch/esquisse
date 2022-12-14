// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 09/16/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, styled, 
  AccordionSummaryProps, AccordionDetailsProps, Tooltip, AccordionProps} from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';

export interface AccordionViewBaseProps extends AccordionProps {
  tooltip?: string;
}

interface AccordionViewBaseInternalProps extends AccordionViewBaseProps {
  header: React.ReactElement;
}

export const AccordionViewBase = (props: AccordionViewBaseInternalProps) => {

  const {tooltip, header, defaultExpanded, children} = props;
  const [expanded, setExpanded] = React.useState(defaultExpanded ?? false);

  const handleChange = (_event: React.SyntheticEvent, expanded: boolean) => {
    setExpanded(expanded);
  }

  return (
    <Accordion
      disableGutters
      expanded={expanded}
      onChange={handleChange}
    >
      <Tooltip title={tooltip ?? ""}>
        <StyledAccordionSummary 
          expandIcon={ExpandIcon}
          aria-controls="panel-content"
          id="panel-header"
        >
          {header}
        </StyledAccordionSummary>
      </Tooltip>
      <StyledAccordionDetails>
        {expanded ? children : null}
      </StyledAccordionDetails>
    </Accordion>
  );
}

const ExpandIcon = <KeyboardArrowRight sx={{opacity: 0.6}}/>;

const StyledAccordionSummary = styled(AccordionSummary)<AccordionSummaryProps>({
  flexDirection: 'row-reverse',
  alignItems: 'center',
  minHeight: 0,
  padding: 0,
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    '&.Mui-expanded': {
      margin: 0,
    }
  }
});

const StyledAccordionDetails = styled(AccordionDetails)<AccordionDetailsProps>({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  padding: '0.3em',
  gap: '0.3em',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    '&.Mui-expanded': {
      margin: 0,
    }
  }
});