export function formatAddress(address: any): string {
  if (!address) return 'ต.สุเทพ อ.เมือง จ.เชียงใหม่';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    const parts: string[] = [];
    if (address.houseNo) parts.push(`บ้านเลขที่ ${address.houseNo}`);
    if (address.alley && address.alley !== '-') parts.push(address.alley.startsWith('ซ.') ? address.alley : `ซ.${address.alley}`);
    if (address.soi && address.soi !== '-') parts.push(address.soi.startsWith('ซ.') ? address.soi : `ซ.${address.soi}`);
    if (address.moo && address.moo !== '-') parts.push(address.moo.startsWith('หมู่') || address.moo.startsWith('ม.') ? address.moo : `ม.${address.moo}`);
    if (address.subdistrict) parts.push(`ต.${address.subdistrict}`);
    if (address.district) parts.push(`อ.${address.district}`);
    if (address.province) parts.push(`จ.${address.province}`);
    return parts.length > 0 ? parts.join(' ') : 'ต.สุเทพ อ.เมือง จ.เชียงใหม่';
  }
  return String(address);
}
