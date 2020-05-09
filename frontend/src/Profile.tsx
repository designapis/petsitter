import React, {useState} from 'react'
import {Form, FormField, Button, Box, Heading} from 'grommet'
import SelectWithBoxes from './SelectWithBoxes'

// import * as userActions from './redux/modules/user'

import { User } from './types'

interface Props {
  user?: User;
  onSave: Function;
  onDelete?: Function;
}

export default function Profile(props: Props) {
  const { onSave, user, onDelete } = props
  const [formValue, setForm] = useState(user || {roles: ['PetOwner'], email: ''})

  const isEdit = !!user

  return (
      <Box background="light-2" pad="medium" >
        <Heading level={3}>{isEdit ? "Update User" : "Create User"}</Heading>
        <Form
          validate="blur"
          value={formValue}
          onChange={(form: any) => setForm(form)}
          onSubmit={(form: any) => onSave(form.value)} >

          <FormField
            required
            name="full_name"
            label="Name"
            onChange={(e) => {
              const full_name = e.target.value
              const email = `${full_name.replace(/[^a-zA-Z0-9]+/g, '.')}@example.com`.toLowerCase()
              const newForm = {
                ...formValue,
                full_name,
                email
              }
              setForm(newForm)
            }} />
          <FormField required name="password" label="Password" type="password" />
          <FormField
            placeholder="jane@example.com"
            required
            name="email"
            label="Email"
            type="email"
            validate={(val: string) => {
              if(!val || !val.endsWith('@example.com'))
                return 'Email ending with @example.com is required.'
            }}
          />
          <FormField
            required
            name="roles"
            multiple
            label="Roles"
            component={SelectWithBoxes}
            options={['PetSitter', 'PetOwner']}
            validate={(val) => {
              if(!val?.length || val.length < 1)
                return 'At least one role is required.'
            }}
          />
          <Box gap="medium" direction="row" justify="between">
            {isEdit && onDelete ? (
              <Button color="status-critical" label="Delete" onClick={() => onDelete(user)}/>
            ) : null}
            <Button type="submit" primary label={isEdit ? "Save" : "Register"}/>
          </Box>
        </Form>
      </Box>
  )
}
