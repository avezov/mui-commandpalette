import { JSX, useRef, useState } from 'react';
import groupBy from 'lodash/groupBy';
import { useHotkeys } from '@xvii/usehooks';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ListSubheader } from '@mui/material';

export type Command = {
  action: () => void
  label: string
  name: string
  group: Group['name']
}

export type Group = {
  label: string
  name: string
}

export type CommandPaletteProps = DialogProps & {
  TextFieldProps?: TextFieldProps,
  commands?: Command[]
  groups?: Group[]
}

export function CommandPalette({
  commands = [],
  groups = [],
  TextFieldProps,
  ...rest
}: CommandPaletteProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const selectedCommand = commands[selectedIndex]
  const [searchText, setSearchText] = useState<string>()
  const commandsByGroup = groupBy(commands, 'group')

  useHotkeys([
    {
      key: 'ArrowDown',
      callback: () => setSelectedIndex(index => index + 1 > commands.length - 1 ? commands.length - 1 : index + 1),
    },
    {
      key: 'ArrowUp',
      callback: () => setSelectedIndex(index => index - 1 < 0 ? 0 : index - 1),
    },
    {
      key: 'Enter',
      callback: selectedCommand?.action
    }
  ], inputRef.current)

  return (
    <Dialog
      scroll="paper"
      {...rest}
    >
      <DialogTitle>
        <TextField
          autoFocus
          fullWidth
          ref={inputRef}
          placeholder="Search some entities or commands"
          variant="outlined"
          onBlur={() => setSelectedIndex(-1)}
          onFocus={() => setSelectedIndex(0)}
          onChange={(evt) => setSearchText(evt.target.value)}
          {...TextFieldProps}
        />
      </DialogTitle>
      <DialogContent
        sx={{ minWidth: '500px' }}
      >
        <List
          dense
          disablePadding
        >
          {groups.map(group => (
            <>
              <ListSubheader>{group.label}</ListSubheader>
              {commandsByGroup[group.name]
                .filter(command => searchText
                  ? command.label.toLowerCase().includes(searchText.toLowerCase())
                  : true
                )
                .map(command => (
                  <ListItemButton
                    disableGutters
                    key={command.name}
                    selected={command.name === selectedCommand?.name}
                    onClick={command.action}
                  >
                    <ListItem>
                      <ListItemText primary={command.label} />
                    </ListItem>
                  </ListItemButton>
                ))}
            </>
          ))}

        </List>
      </DialogContent>
    </Dialog>
  )
}