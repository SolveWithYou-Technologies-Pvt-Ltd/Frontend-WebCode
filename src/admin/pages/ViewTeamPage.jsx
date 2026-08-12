import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import TeamTreeNode from "../components/TeamTreeNode";
import { getTeamTree } from "../services/adminUserService";

const MIN_SCALE = 0.2;
const MAX_SCALE = 1.8;
const ZOOM_STEP = 0.1;
const HORIZONTAL_PADDING = 32;
const VERTICAL_PADDING = 24;

const clampScale = (value) => {
  return Math.min(
    MAX_SCALE,
    Math.max(MIN_SCALE, value)
  );
};

const ViewTeamPage = () => {
  const viewportRef = useRef(null);
  const chartRef = useRef(null);
  const fitModeRef = useRef(true);

  const [teamTree, setTeamTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scale, setScale] = useState(1);
  const [chartSize, setChartSize] = useState({
    width: 1,
    height: 1,
  });

  useEffect(() => {
    const loadTeamHierarchy = async () => {
      try {
        setError("");

        const result = await getTeamTree();
        setTeamTree(result.tree || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load team hierarchy"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeamHierarchy();
  }, []);

  const centerHierarchy = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    window.requestAnimationFrame(() => {
      const centerLeft = Math.max(
        (viewport.scrollWidth - viewport.clientWidth) / 2,
        0
      );

      viewport.scrollTo({
        left: centerLeft,
        top: 0,
        behavior: "auto",
      });
    });
  }, []);

  const fitHierarchy = useCallback(() => {
    const viewport = viewportRef.current;
    const chart = chartRef.current;

    if (!viewport || !chart) return;

    const contentWidth = Math.max(chart.scrollWidth, 1);
    const contentHeight = Math.max(chart.scrollHeight, 1);

    setChartSize({
      width: contentWidth,
      height: contentHeight,
    });

    const availableWidth = Math.max(
      viewport.clientWidth - HORIZONTAL_PADDING,
      1
    );

    const availableHeight = Math.max(
      viewport.clientHeight - VERTICAL_PADDING,
      1
    );

    const fittedScale = clampScale(
      Math.min(
        availableWidth / contentWidth,
        availableHeight / contentHeight,
        1
      )
    );

    fitModeRef.current = true;
    setScale(Number(fittedScale.toFixed(2)));
    centerHierarchy();
  }, [centerHierarchy]);

  useEffect(() => {
    if (loading || teamTree.length === 0) {
      return undefined;
    }

    let secondFrame;

    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(
        fitHierarchy
      );
    });

    const observer = new ResizeObserver(() => {
      if (fitModeRef.current) {
        fitHierarchy();
      }
    });

    if (viewportRef.current) {
      observer.observe(viewportRef.current);
    }

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);

      if (secondFrame) {
        window.cancelAnimationFrame(secondFrame);
      }

      observer.disconnect();
    };
  }, [fitHierarchy, loading, teamTree]);

  const changeZoom = (difference) => {
    fitModeRef.current = false;

    setScale((currentScale) =>
      Number(
        clampScale(
          currentScale + difference
        ).toFixed(2)
      )
    );
  };

  const scaledWidth = Math.max(
    chartSize.width * scale,
    1
  );

  const scaledHeight = Math.max(
    chartSize.height * scale,
    1
  );

  return (
    <section className="relative h-[calc(100dvh-5rem)] min-h-[430px] w-full overflow-hidden">
      

      {!loading && teamTree.length > 0 && (
        <div className="absolute right-3 top-3 z-40 flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white/90 p-1 shadow-lg backdrop-blur sm:right-5 sm:top-4">
          <button
            type="button"
            onClick={() => changeZoom(-ZOOM_STEP)}
            disabled={scale <= MIN_SCALE}
            title="Zoom out"
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center rounded-md text-base font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
          >
            −
          </button>

          <button
            type="button"
            onClick={fitHierarchy}
            title="Fit hierarchy to screen"
            className="h-8 rounded-md px-2.5 text-[9px] font-bold text-blue-700 transition hover:bg-blue-50 sm:text-[10px]"
          >
            Fit
          </button>

          <span className="min-w-10 text-center text-[9px] font-semibold text-slate-500 sm:min-w-11 sm:text-[10px]">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={() => changeZoom(ZOOM_STEP)}
            disabled={scale >= MAX_SCALE}
            title="Zoom in"
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center rounded-md text-base font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
          >
            +
          </button>
        </div>
      )}

      {error && (
        <p className="absolute bottom-3 left-1/2 z-40 max-w-[90%] -translate-x-1/2 rounded-lg bg-red-50 px-3 py-2 text-center text-[10px] text-red-600 shadow-sm sm:text-xs">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-[10px] text-slate-500 sm:text-xs">
            Loading team hierarchy...
          </p>
        </div>
      ) : teamTree.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-[10px] text-slate-500 sm:text-xs">
            No active team hierarchy found.
          </p>
        </div>
      ) : (
        <div
          ref={viewportRef}
          className="h-full w-full overflow-auto overscroll-contain pt-2 [scrollbar-width:thin] sm:pt-3"
        >
          <div className="flex min-h-full min-w-full items-start justify-center px-2 pb-5 sm:px-4">
            <div
              className="relative shrink-0"
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
              }}
            >
              <div
                ref={chartRef}
                className="absolute left-1/2 top-0 flex min-w-max items-start justify-center gap-3"
                style={{
                  transform: `translateX(-50%) scale(${scale})`,
                  transformOrigin: "top center",
                }}
              >
                {teamTree.map((rootNode) => (
                  <ul
                    key={
                      rootNode._id ||
                      rootNode.employeeCode ||
                      rootNode.email
                    }
                    className="flex min-w-max justify-center"
                  >
                    <TeamTreeNode node={rootNode} />
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewTeamPage;
