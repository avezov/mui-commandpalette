import { JSX, useEffect, useRef, useState } from 'react';
import groupBy from 'lodash/groupBy.js';
import { useHotkeys } from '@xvii/usehooks';
import Dialog, { DialogProps } from '@mui/material/Dialog/index.js';
import DialogContent from '@mui/material/DialogContent/index.js';
import DialogTitle from '@mui/material/DialogTitle/index.js';
import List from '@mui/material/List/index.js';
import ListItem from '@mui/material/ListItem/index.js';
import ListItemButton from '@mui/material/ListItemButton/index.js';
import ListItemText from '@mui/material/ListItemText/index.js';
import ListSubheader from '@mui/material/ListSubheader/index.js';
import TextField, { TextFieldProps } from '@mui/material/TextField/index.js';

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
  const [searchText, setSearchText] = useState<string>()
  const commandsByGroup = groupBy(commands, 'group')
  const filteredCommands = commands
    .filter(command => searchText
      ? command.label.toLowerCase().includes(searchText.toLowerCase())
      : true)

  /** @todo filter commands by searchText */
  const selectedCommand = filteredCommands[selectedIndex]

  useHotkeys([
    {
      key: 'ArrowDown',
      callback: () => setSelectedIndex(index => index + 1 > filteredCommands.length - 1 ? filteredCommands.length - 1 : index + 1),
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

  useEffect(() => {
    setSelectedIndex(0)
  }, [
    searchText
  ])

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
          {...TextFieldProps}
          onChange={(evt) => {
            TextFieldProps?.onChange?.(evt)
            setSearchText(evt.target.value)
          }}
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
                ?.filter(command => searchText
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