"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import { Skeleton } from "@/shared/components/ui/Skeleton"

const EXPAND_ANIMATION_MS = 480
const MOBILE_CARD_BACKGROUNDS = [
  "bg-white dark:bg-slate-900",
  "bg-indigo-100 dark:bg-slate-800",
  "bg-indigo-600 dark:bg-indigo-900",
] as const
const MOBILE_CARD_VARIANTS = ["slate", "indigo", "indigo"] as const
type MobileCardVariant = (typeof MOBILE_CARD_VARIANTS)[number]

interface CardStackProps {
  children: React.ReactNode
  className?: string
  desktopGridClassName?: string
}

export function CardStack({
  children,
  className,
  desktopGridClassName = "md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6",
}: CardStackProps) {
  const router = useRouter()
  const items = React.Children.toArray(children)
  const [expandedCard, setExpandedCard] = React.useState<{
    href: string
    rect: DOMRect
    index: number
    variant: MobileCardVariant
  } | null>(null)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)")
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateMobile = () => setIsMobile(mobileQuery.matches)
    const updateReduce = () => setPrefersReducedMotion(reduceQuery.matches)

    updateMobile()
    updateReduce()

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", updateMobile)
      reduceQuery.addEventListener("change", updateReduce)
    } else {
      mobileQuery.addListener(updateMobile)
      reduceQuery.addListener(updateReduce)
    }

    return () => {
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener("change", updateMobile)
        reduceQuery.removeEventListener("change", updateReduce)
      } else {
        mobileQuery.removeListener(updateMobile)
        reduceQuery.removeListener(updateReduce)
      }
    }
  }, [])

  React.useEffect(() => {
    if (!expandedCard) return

    const animationFrame = window.requestAnimationFrame(() => {
      setIsExpanded(true)
    })

    const timeout = window.setTimeout(() => {
      router.push(expandedCard.href)
    }, EXPAND_ANIMATION_MS)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(timeout)
      document.body.style.overflow = previousOverflow
    }
  }, [expandedCard, router])

  const handleCardLinkClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const link = target.closest<HTMLElement>("[data-card-link]")
      if (!link) return

      const href = link.getAttribute("data-href")
      if (!href) return

      if (!isMobile || prefersReducedMotion || expandedCard) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const card = link.closest<HTMLElement>("[data-card-stack-item]")
      if (!card) return

      const rect = card.getBoundingClientRect()
      const indexAttr = card.getAttribute("data-card-index")
      const index = indexAttr ? Number(indexAttr) : 0
      const safeIndex = Number.isFinite(index) ? index : 0
      const variant = MOBILE_CARD_VARIANTS[safeIndex % MOBILE_CARD_VARIANTS.length]
      setIsExpanded(false)
      setExpandedCard({ href, rect, index: safeIndex, variant })
    },
    [expandedCard, isMobile, prefersReducedMotion]
  )

  return (
    <div
      className={cn(
        "flex flex-col pb-0 md:pb-32",
        desktopGridClassName,
        className
      )}
      onClickCapture={handleCardLinkClick}
    >
      {/* 
        This style block overrides the inner Card component styles.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        .card-stack-override .card-corners {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: inherit !important;
          backdrop-filter: none !important;
        }
        /* Remove gradient/vignette overlay on cards */
        .card-stack-override .card-corners::before {
          display: none !important;
        }

        /* 
         Overrides for the Primary Card (Index 2 - 3rd Card) 
         Use specificity to override Tailwind utility classes on inner elements
        */
        .card-stack-override.stack-card-primary .text-slate-900,
        .card-stack-override.stack-card-primary .text-slate-600,
        .card-stack-override.stack-card-primary .text-indigo-600,
        .card-stack-override.stack-card-primary .text-indigo-700,
        .card-stack-override.stack-card-primary .text-indigo-500 {
           color: white !important;
        }
        
        .card-stack-override.stack-card-primary .bg-indigo-50 {
           background-color: rgba(255, 255, 255, 0.1) !important;
           border-color: rgba(255, 255, 255, 0.2) !important;
        }

        .card-stack-override.stack-card-primary .text-slate-500 {
           color: rgba(255, 255, 255, 0.7) !important;
        }
        
        /* Specific override for the date/time box in ScheduleWidget */
        .card-stack-override.stack-card-primary .bg-indigo-50 .text-indigo-700 {
            color: white !important;
        }
        .card-stack-override.stack-card-primary .bg-indigo-50 .text-indigo-400 {
            color: rgba(255, 255, 255, 0.8) !important;
        }

        .card-stack-override.stack-card-primary .dashboard-card-link {
          color: white !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }

        .card-stack-override.stack-card-primary .dashboard-card-link:hover {
          background-color: rgba(255, 255, 255, 0.16) !important;
        }
      `}} />

      {items.map((child, index) => {
        const isPrimary = index % 3 === 2; // 3rd card (index 2)
        const isLast = index === items.length - 1

        // Cycle: White -> Indigo 100 -> Indigo 600 (Primary)
        const mobileBgClass = MOBILE_CARD_BACKGROUNDS[index % MOBILE_CARD_BACKGROUNDS.length]
        const mobileVariant = MOBILE_CARD_VARIANTS[index % MOBILE_CARD_VARIANTS.length]

        const isOddIndex = index % 2 !== 0;
        
        return (
          <div
            key={index}
            data-card-stack-item
            data-card-index={index}
            data-skeleton-variant={mobileVariant}
            className={cn(
              "card-stack-override",
              isPrimary ? "stack-card-primary" : "",
              isLast ? "overflow-hidden max-h-[72svh] rounded-none md:overflow-visible md:max-h-none md:rounded-2xl" : "",
              // Mobile Styles
              "relative border border-slate-200 shadow-sm dark:border-slate-800",
              "rounded-none", 
              isOddIndex ? "transform skew-y-2" : "transform -skew-y-2", // Alternating tilt
              
              // Edges Logic: Restore internal padding (outer container handles bleed)
              "-mx-4 px-4",

              // Overlap logic:
              // -mt-24 pulls this card UP to cover the bottom of the previous card
              // first:mt-0 removes margin from the first card so it starts naturally in flow
              "-mt-24 first:mt-0", 
              
              // Expand bottom logic:
              // pb-20 adds extra space at the bottom of the card content
              // last:pb-24 adds space below the "Voir plus" button of the last card
              "pb-20 last:pb-24",
              
              mobileBgClass,
              
              // Desktop Styles (Reset)
              "md:static md:mt-0 md:rounded-2xl md:bg-white/80 md:backdrop-blur-md md:dark:bg-transparent md:transform-none",
              "md:border-slate-200 md:dark:border-transparent md:shadow-sm md:dark:shadow-none md:pb-0 md:mx-0 md:px-0"
            )}
            style={{
              zIndex: index,
            }}
          >
            <div className={cn(
              isOddIndex ? "transform -skew-y-2" : "transform skew-y-2", // Counter-tilt content
              "md:transform-none"
            )}>
              {child}
            </div>
          </div>
        )
      })}

      {expandedCard && (
        <div
          aria-hidden="true"
          className={cn(
            "fixed z-[70] overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950",
            "transition-[top,left,width,height,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isExpanded ? "rounded-none" : "rounded-2xl",
            MOBILE_CARD_BACKGROUNDS[expandedCard.index % MOBILE_CARD_BACKGROUNDS.length]
          )}
          data-skeleton-variant={expandedCard.variant}
          style={{
            top: isExpanded ? 0 : expandedCard.rect.top,
            left: isExpanded ? 0 : expandedCard.rect.left,
            width: isExpanded ? "100vw" : expandedCard.rect.width,
            height: isExpanded ? "100vh" : expandedCard.rect.height,
          }}
        >
          <div className="h-full w-full">
            <div className="p-6 space-y-5">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-2/3" />
              <div className="space-y-4 pt-2">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
              <div className="pt-2 flex justify-end">
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
