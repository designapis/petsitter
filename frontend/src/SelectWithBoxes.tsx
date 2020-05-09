import React from "react"
import { Box, CheckBox, RadioButtonGroup } from 'grommet'

interface SelectWithBoxesProps {
  value: string[];
  options: string[];
  onChange: Function;
  multiple?: boolean;
  name?: string;
}

export default function SelectWithBoxes (props: SelectWithBoxesProps) {
  const { options, onChange, value=[], multiple, name="" } = props

  const onCheckboxChange = (e: any, label: string) => {
    const { checked } = e.target
    const newValue = [...value]

    if(checked){
      newValue.push(label)
    } else {
      const i = newValue.findIndex((a: string) => a === label)
      newValue.splice(i, 1)
    }

    if(onChange) {
      onChange({target: {value: newValue}})
    }
  }

  return (
    <Box direction="row" gap="small" pad="small">
      {
        multiple ? options.map( (option) => {
          const checked = (value || '').includes(option)
         return (
           <CheckBox
             key={option+''}
             label={option}
             onChange={(e) => onCheckboxChange(e, option)}
             checked={checked}
           />
         )
        }) : (

          <RadioButtonGroup direction="row" gap="small" name={name} onChange={(e) => onChange(e)} options={options}/>
        )
      }
    </Box>
  )
}
