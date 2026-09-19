import networkx as nx

def analyze_transaction_network(nodes_data: list, edges_data: list) -> dict:
    """
    Uses NetworkX to build a directed graph of transactions between wallets
    and calculate centrality metrics, circular paths, and hub detection.
    """
    G = nx.DiGraph()
    
    for node in nodes_data:
        G.add_node(node["id"], address=node.get("address"), risk_score=node.get("risk_score", 0))
        
    for edge in edges_data:
        G.add_edge(
            edge["source"],
            edge["target"],
            amount=edge.get("amount", 0.0),
            tx_hash=edge.get("tx_hash", "")
        )
        
    degree_centrality = nx.degree_centrality(G) if len(G) > 0 else {}
    betweenness_centrality = nx.betweenness_centrality(G) if len(G) > 0 else {}
    in_degree = dict(G.in_degree()) if len(G) > 0 else {}
    out_degree = dict(G.out_degree()) if len(G) > 0 else {}
    
    # Detect simple cycles (circular flows)
    try:
        cycles = list(nx.simple_cycles(G))
        circular_paths_count = len(cycles)
    except Exception:
        cycles = []
        circular_paths_count = 0

    hubs = [node for node, deg in out_degree.items() if deg > 5]
    sinks = [node for node, deg in in_degree.items() if deg > 5]
    
    return {
        "total_nodes": G.number_of_nodes(),
        "total_edges": G.number_of_edges(),
        "degree_centrality": degree_centrality,
        "betweenness_centrality": betweenness_centrality,
        "in_degree": in_degree,
        "out_degree": out_degree,
        "circular_paths_count": circular_paths_count,
        "circular_cycles": cycles[:10], # Top 10 cycle paths
        "hubs": hubs,
        "sinks": sinks
    }
