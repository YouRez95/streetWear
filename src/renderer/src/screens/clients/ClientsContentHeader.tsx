'use client'

import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'

import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'

import { Button } from '@renderer/components/ui/button'
import { Switch } from '@renderer/components/ui/switch'
import { activeClientsWithBons } from '@renderer/data/placeholder-data'
import { toast } from '@renderer/hooks/use-toast'
import { useUserStore } from '@renderer/store'
import { FunnelPlus, HandCoins, Lock, Trash, Unlock } from 'lucide-react'
import { useEffect, useState } from 'react'
// import AddAvanceDialog from './AddAvanceDialog'
// import { CloseBonDialog } from './CloseBonDialog'
// import { DeleteBonDialog } from './DeleteBonDialog'
// import { OpenBonDialog } from './OpenBonDialog'

interface ClientsContentHeaderProps {
  openBon: boolean
  setOpenBon: (open: boolean) => void
  closedBon: boolean
  setClosedBon: (closed: boolean) => void
}

export default function ClientsContentHeader({
  openBon,
  setOpenBon,
  closedBon,
  setClosedBon
}: ClientsContentHeaderProps) {
  const { selectedClientId, selectedClientBonId, setSelectedClientId, setSelectedClientBonId } =
    useUserStore()
  const [openAvanceDialog, setOpenAvanceDialog] = useState(false)
  const [openCloseBonDialog, setOpenCloseBonDialog] = useState(false)
  const [openOpenBonDialog, setOpenOpenBonDialog] = useState(false)
  const [openDeleteBonDialog, setOpenDeleteBonDialog] = useState(false)
  // const { data: activeFaconniers } = useActiveFaconniers(openBon, closedBon)
  const activeClients = activeClientsWithBons

  const selectedClient = (activeClients?.clients ?? []).find(
    (client) => client.id === selectedClientId
  )

  const bons = selectedClient?.BonsClient || []
  const selectedBon = selectedClient?.BonsClient.find((bon) => bon.id === selectedClientBonId)

  useEffect(() => {
    if (!activeClients) return
    if (
      activeClients.clients &&
      activeClients.clients.length > 0 &&
      !activeClients.clients.some((c) => c.id === selectedClientId)
    ) {
      setSelectedClientId(activeClients.clients[0].id)
    }
  }, [activeClients, selectedClientId])

  // Only update if selectedBonId is not in the current bons
  useEffect(() => {
    if (bons.length > 0 && !bons.some((bon) => bon.id === selectedClientBonId)) {
      setSelectedClientBonId(bons[0].id)
    } else if (bons.length === 0 && selectedClientBonId !== '') {
      setSelectedClientBonId('')
    }
  }, [selectedClientId, bons])

  const handleOpenAvanceDialog = () => {
    if (!selectedClientId || !selectedClientBonId) {
      toast({
        title: 'Please select a client and a bon to add an avance',
        variant: 'destructive'
      })
      return
    }
    setOpenAvanceDialog(true)
  }

  return (
    <div className="flex justify-between items-center mb-10 w-full">
      <div className="flex gap-4 items-center">
        {/* Faconnier Dropdown */}
        <Select value={selectedClientId} onValueChange={(val) => setSelectedClientId(val)}>
          <SelectTrigger className="w-[200px] border-background/50 border rounded-md p-3 data-[placeholder]:text-background">
            <SelectValue placeholder="Select Faconnier" />
          </SelectTrigger>
          <SelectContent className="">
            {activeClients?.clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bons Dropdown */}
        <Select
          value={selectedClientBonId || ''}
          onValueChange={(val) => setSelectedClientBonId(val)}
        >
          <SelectTrigger className="w-[200px] border-background/50 border rounded-md p-3 data-[placeholder]:text-background">
            <SelectValue placeholder="Select Bon" className="" />
          </SelectTrigger>
          <SelectContent>
            {bons.map((bon) => (
              <SelectItem key={bon.id} value={bon.id}>
                Bon #{bon.bon_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Bon Status */}
        <div className="text-sm font-semibold bg-yellow-300 p-2 rounded-md">
          {selectedBon?.bonStatus === 'OPEN' ? 'bon open' : 'bon closed'}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Delete Bon */}
        {selectedClient && selectedBon && (
          <Button
            variant="destructive"
            className="bg-destructive text-foreground font-semibold flex items-center gap-2"
            onClick={() => setOpenDeleteBonDialog(true)}
          >
            <Trash className="w-4 h-4 mb-1" />
            Supprimer le bon
          </Button>
        )}
        {/* Close Bon and Open Bon */}
        {selectedBon?.bonStatus === 'OPEN' && (
          <Button
            onClick={() => setOpenCloseBonDialog(true)}
            disabled={!selectedBon}
            aria-label="Close selected bon"
            className="bg-secondary text-foreground hover:bg-secondary/90 font-semibold flex items-center gap-2"
          >
            <Lock className="w-4 h-4 mb-1" />
            Fermer le bon
          </Button>
        )}
        {selectedBon?.bonStatus === 'CLOSED' && (
          <Button
            onClick={() => setOpenOpenBonDialog(true)}
            disabled={!selectedBon}
            aria-label="Open selected bon"
            className="bg-secondary text-foreground hover:bg-secondary/90 font-semibold flex items-center gap-2"
          >
            <Unlock className="w-4 h-4 mb-1" />
            Ouvrir le bon
          </Button>
        )}
        {/* Add Avance */}
        {selectedClient && selectedBon && (
          <Button
            onClick={handleOpenAvanceDialog}
            className="bg-primary text-foreground hover:bg-primary/90 font-semibold flex items-center gap-2"
          >
            <HandCoins className="w-4 h-4 mb-1" />
            Add Avance
          </Button>
        )}
        {/* Filter Bons */}
        <Popover>
          <PopoverTrigger>
            <FunnelPlus className="w-8 h-8 cursor-pointer text-background/70 border border-background/50 rounded-md p-2 hover:bg-background/10 transition" />
          </PopoverTrigger>

          <PopoverContent className="w-[150px] p-4 mr-5">
            <div className="text-base font-semibold mb-2">Filter Bons</div>
            <div className="border-b border-background/20 mb-3" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="open" className="text-sm font-medium">
                  Open
                </Label>
                <Switch
                  className=""
                  id="open"
                  checked={openBon}
                  onCheckedChange={(checked) => {
                    if (!checked && !closedBon) return
                    setOpenBon(checked)
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="closed" className="text-sm font-medium">
                  Closed
                </Label>
                <Switch
                  id="closed"
                  checked={closedBon}
                  onCheckedChange={(checked) => {
                    if (!checked && !openBon) return
                    setClosedBon(checked)
                  }}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* <AddAvanceDialog
        open={openAvanceDialog}
        setOpen={setOpenAvanceDialog}
        selectedFaconnierId={selectedFaconnierId}
        selectedBonId={selectedBonId}
      /> */}

      {/* Only show CloseBonDialog if bon is OPEN */}
      {/* {selectedBon?.bonStatus === 'OPEN' && (
        <CloseBonDialog
          open={openCloseBonDialog}
          setOpen={setOpenCloseBonDialog}
          selectedFaconnierId={selectedFaconnierId}
          selectedBonId={selectedBonId}
          setSelectedBonId={setSelectedBonId}
        />
      )} */}

      {/* Only show OpenBonDialog if bon is CLOSED */}
      {/* {selectedBon?.bonStatus === 'CLOSED' && (
        <OpenBonDialog
          open={openOpenBonDialog}
          setOpen={setOpenOpenBonDialog}
          selectedFaconnierId={selectedFaconnierId}
          selectedBonId={selectedBonId}
          setSelectedBonId={setSelectedBonId}
        />
      )} */}

      {/* {openDeleteBonDialog && (
        <DeleteBonDialog
          open={openDeleteBonDialog}
          setOpen={setOpenDeleteBonDialog}
          bonNumber={selectedBon?.bon_number || 0}
          bonId={selectedBonId}
        />
      )} */}
    </div>
  )
}
