"use client";

/**
 * LazyHello
 * Magyar: Késleltetve betöltődő apró komponens, a kódszeletelés bemutatására.
 * - Szimulál egy rövid késleltetést, majd kiír egy rövid szöveget.
 */
export default function LazyHello() {
  return (
    <Delayed ms={600}>
      <span className="text-sm text-muted-foreground">Szia! Ez egy lusta komponens. 👋</span>
    </Delayed>
  );
}

/**
 * Delayed
 * Magyar: Egyszerű segéd komponens, amely a children-t csak egy rövid késleltetés után jeleníti meg.
 */
function Delayed(props: { ms?: number; children?: any }) {
  const { ms = 600, children } = props;
  const [ready] = useDelay(ms);
  if (!ready) return null;
  return children ?? null;
}

/**
 * useDelay
 * Magyar: Visszaad egy boolean állapotot, amely a megadott késleltetés után true-ra vált.
 */
function useDelay(ms: number): [boolean] {
  // Lokális React hivatkozás @types/react nélkül.
  const ReactRef: any = (globalThis as any).React || require("react");
  const useEffect: any = ReactRef.useEffect;
  const useState: any = ReactRef.useState;

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return [ready];
}