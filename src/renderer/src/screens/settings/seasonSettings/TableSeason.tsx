import { PaginationComponent } from '@renderer/components/pagination'
import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Switch } from '@renderer/components/ui/switch'
import { useSeasons } from '@renderer/hooks/useSeason'
import { cn } from '@renderer/lib/utils'
import { useUserStore } from '@renderer/store'
import { useDebounce } from '@uidotdev/usehooks'
import {
  ArrowDownSquare,
  ArrowRightSquare,
  ArrowUpSquare,
  PencilIcon,
  Trash2Icon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { DeleteSeasonDialog } from './DeleteSeasonDialog'
import UpdateSeasonDialog from './UpdateSeasonDialog'

type TableSeasonProps = {
  searchTerm: string
}

export default function TableSeason({ searchTerm }: TableSeasonProps) {
  const { activeSeason, setActiveSeason } = useUserStore()
  const [selectedSeason, setSelectedFaconnier] = useState<SeasonData | null>(null)
  const [limit, setLimit] = useState(8)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [open, setOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'update' | 'delete' | null>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data: seasonsData, isLoading, error } = useSeasons(page, limit, debouncedSearchTerm)
  console.log('seasonsData error', error)

  useEffect(() => {
    if (seasonsData?.totalPages) {
      setTotalPages(seasonsData.totalPages)
    }
  }, [seasonsData])

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  const openDialog = (season: SeasonData, type: 'update' | 'delete') => {
    setSelectedFaconnier(season)
    setDialogType(type)
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
    setSelectedFaconnier(null)
    setDialogType(null)
  }

  if (isLoading) return <p className="text-background/50">Chargement...</p>

  if (error || seasonsData?.status === 'failed')
    return <p className="text-background/50">Erreur lors de la récupération des saisons</p>
  return (
    <div className="flex items-center justify-start gap-10 w-full h-full flex-wrap">
      {seasonsData && seasonsData.seasons.length === 0 && (
        <p className="text-background/50">Aucune saison trouvée, créez une pour commencer.</p>
      )}
      {seasonsData &&
        seasonsData.seasons.map((season, index) => (
          <Card
            key={season.id}
            className="min-w-[400px] rounded-xl hover:shadow-xl transition-all cursor-pointer"
          >
            <CardHeader
              className={cn(
                `relative space-y-5 min-h-[150px]`,
                index % 2 === 0 ? 'bg-background/80' : 'bg-secondary/80'
              )}
            >
              <CardTitle className="text-lg font-bagel text-foreground flex items-center gap-2">
                <span>{season.name.toUpperCase()}</span>
                <div>
                  <Switch
                    checked={season.id === activeSeason?.id}
                    className={cn(
                      index % 2 === 0
                        ? 'data-[state=checked]:bg-background'
                        : 'data-[state=checked]:bg-secondary'
                    )}
                    onCheckedChange={() => setActiveSeason(season)}
                  />
                </div>
              </CardTitle>
              <CardDescription className="text-base font-medium text-foreground/70 space-y-1">
                <p>{season.description ? season.description : 'Aucune description trouvée'}</p>
                {season.summary.type && (
                  <p className="flex items-center gap-1">
                    {season.summary.type === 'down' ? (
                      <ArrowDownSquare className="inline-block text-foreground/50" />
                    ) : season.summary.type === 'up' ? (
                      <ArrowUpSquare className="inline-block text-foreground/50" />
                    ) : (
                      <ArrowRightSquare className="inline-block text-foreground/50" />
                    )}
                    {season.summary.percentage} par rapport à la saison précédente
                  </p>
                )}
              </CardDescription>
              <div className="absolute right-5 top-0 gap-3 flex">
                <Button
                  variant={'ghost'}
                  onClick={() => openDialog(season, 'update')}
                  className="bg-foreground hover:bg-transparent hover:text-foreground border-foreground border p-[8px]"
                >
                  <PencilIcon />
                </Button>
                <Button
                  onClick={() => openDialog(season, 'delete')}
                  variant={'ghost'}
                  className="bg-foreground hover:bg-transparent hover:text-foreground border-foreground border p-[8px]"
                >
                  <Trash2Icon />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex text-base p-0 font-semibold">
              <div className="flex-1 text-center text-primary border-r  p-6">
                <p>Produits</p>
                <span>{season.products.totalProducts}</span>
              </div>
              <div className="flex-1 text-center text-secondary p-6 border-r">
                <p>Achats</p>
                <span>{season.products.totalClient}</span>
              </div>
              <div className="flex-1 text-center text-destructive p-6">
                <p className=" text-base">Stock</p>
                <span>{season.products.totalStock}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      {open && selectedSeason && dialogType === 'update' && (
        <UpdateSeasonDialog open={open} closeDialog={closeDialog} season={selectedSeason} />
      )}
      {open && selectedSeason && dialogType === 'delete' && (
        <DeleteSeasonDialog
          open={open}
          closeDialog={closeDialog}
          seasonId={selectedSeason.id}
          seasonName={selectedSeason.name}
        />
      )}
      <div className="absolute bottom-0 h-16 bg-foreground border w-full -ml-7 rounded-t-xl">
        <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  )
}
