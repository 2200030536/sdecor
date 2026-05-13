try {
    $r = Invoke-RestMethod 'http://localhost:3000/api/packages'
    Write-Host "Packages from Next.js API: $($r.count)"
    if ($r.count -gt 0) { Write-Host "First: $($r.data[0].title)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
